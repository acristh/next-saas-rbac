import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import type { FastifyInstance } from 'fastify/types/instance'
import { z } from 'zod'

export async function createAccount(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/users',{
        schema: {
            tags: ['auth'],
            summary: 'Create a new user account.',
            body: z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string().min(6),
            })
        },
    }, 
    async (request, response) => {
        const { name, email, password } = request.body

        const userWithSameEmail = await prisma.user.findUnique({
            where: { email }
        })

        if (userWithSameEmail) {
            return response
                .status(400)
                .send({message: 'user with same e-mail already exists.'})
        }

        const [, domain] = email.split('@')

        const autoJoinOrganization = await prisma.organization.findFirst({
            where: { 
                domain,
                shouldAttachUsersByDomain: true,
            },
        })

        const passwordHash = await hash(password, 6)

        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                member_on: autoJoinOrganization 
                    ? {
                        create: {
                            organizationId: autoJoinOrganization.id,
                        }
                    } 
                    : undefined,
            },
        })

        return response.status(201).send()
    },
)
}