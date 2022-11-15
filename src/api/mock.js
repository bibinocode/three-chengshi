export const getInfo = () => {
  return fetch('http://127.0.0.1:4523/m1/1758416-0-default/api/smartcity/info').then(res => res.json()).then(data => {
    return data.data
  })
}

export const getList = () => {
  return fetch('http://127.0.0.1:4523/m1/1758416-0-default/api/smartcity/list').then(res => res.json()).then(data => {
    return data.list
  })
}