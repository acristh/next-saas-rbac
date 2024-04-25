import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import type { FastifyInstance } from 'fastify/types/instance'
import { z } from 'zod'

export async function createAccount(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/users',{
        schema: {
            body: z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string().min(6),
            })
        },
    }, () => {
        return 'User created'
    })
}