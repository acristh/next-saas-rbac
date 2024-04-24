import {
  AbilityBuilder,
  CreateAbility,
  MongoAbility,
  createMongoAbility
} from '@casl/ability'
import { z } from 'zod'

import { User } from './models/user'
import { permissions } from './permissions'
import { billingSubject } from './subjects/billing'
import { inviteSubject } from './subjects/invite'
import { organizationSubject } from './subjects/organization'
import { projectSubject } from './subjects/project'
import { userSubject } from './subjects/user'

const AppAbilitiesSchema = z.union([
  projectSubject,
  userSubject,
  billingSubject,
  organizationSubject,
  inviteSubject,

  z.tuple([
    z.literal('manage'),
    z.literal('all')
  ])
])

type AppAbilities = z.infer<typeof AppAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityForUser(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if(typeof permissions[user.role] !== 'function') {
    throw new Error(`Permission for role ${user.role} not found`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build()

  return ability
  
}
