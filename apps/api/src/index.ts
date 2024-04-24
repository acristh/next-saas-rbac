import { defineAbilityForUser, projectSchema } from "@saas/auth";

const ability = defineAbilityForUser({ role: 'MEMBER', id: 'user-id'})

const project = projectSchema.parse({
    id: 'project-id',
    ownerId: 'user-id'
})

console.log(ability.can('get', 'Billing'))
console.log(ability.can("update", "User"))
console.log(ability.can("delete", project))