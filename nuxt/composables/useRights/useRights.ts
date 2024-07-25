import { useMainStore } from '~/store/main/main'

const defaultRights = {
  creating: false,
  reading: false,
  updating: false,
  deleting: false,
}

export function useRights(path: string) {
  const route = path.startsWith('/') ? path.slice(1) : path
  const rights = ref(defaultRights)
  const mainStore = useMainStore()

  watch(
    () => mainStore.profile,
    () => {
      if (mainStore.profile?.roles) {
        const roles = Array.isArray(mainStore.profile.roles)
          ? mainStore.profile.roles
          : [mainStore.profile.roles]

        const newRights = { ...defaultRights }

        for (const role of roles) {
          if (role.admin) {
            newRights.creating = true
            newRights.reading = true
            newRights.updating = true
            newRights.deleting = true
            break
          }

          if (role.resources) {
            for (const resource of role.resources) {
              if (
                resource.path !== route ||
                resource.RolesResources === undefined
              )
                continue

              newRights.creating = resource.RolesResources.creating
              newRights.reading = resource.RolesResources.reading
              newRights.updating = resource.RolesResources.updating
              newRights.deleting = resource.RolesResources.deleting
            }
          }
        }

        if (
          rights.value.creating !== newRights.creating ||
          rights.value.reading !== newRights.reading ||
          rights.value.updating !== newRights.updating ||
          rights.value.deleting !== newRights.deleting
        ) {
          rights.value = newRights
        }
      } else {
        rights.value = defaultRights
      }
    },
    { immediate: true }
  )

  return rights
}
