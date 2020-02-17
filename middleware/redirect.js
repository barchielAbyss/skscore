export default function({ store, route, redirect }) {
  const routerList = store.state.user.routerList
  const routerItem = routerList.find(item => route.name === item.name)

  if (routerItem && routerItem.children) {
    return redirect(routerItem.children[0])
  }
}
