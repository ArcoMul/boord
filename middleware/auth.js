export default function({ route, store, redirect, error }) {
  if (!store.state.user) {
    if (route.fullPath !== '/') {
      const from = encodeURIComponent(route.fullPath)
      return redirect(`/login?from_url=${from}`)
    }
    return redirect('/login')
  }
  if (
    (!store.state.user.permissions ||
      !store.state.user.permissions.includes('user')) &&
    route.fullPath !== '/no-access'
  ) {
    return redirect('/no-access')
  }
}
