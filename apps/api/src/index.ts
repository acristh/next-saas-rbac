import { defineAbilityForUser } from "@saas/auth";

const ability = defineAbilityForUser({ role: 'MEMBER'})

const userCanInviteSomeoneElse = ability.can('invite', 'User')
const userCanDeleteOtherUsers = ability.can('delete', 'User')

const userCannotDeleteOtherUsers = ability.cannot('delete', 'User')

console.warn(userCanInviteSomeoneElse, userCanDeleteOtherUsers, userCannotDeleteOtherUsers)