const socket = io()
let connectionsData = []

socket.on('admin_list_all_users', connections => {
  connectionsData = connections

  document.getElementById('list_users').innerHTML = ""
  const template = document.getElementById('template').innerHTML

  connections.forEach(connection => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id
    })

    document.getElementById('list_users').innerHTML += rendered
  })
})

socket.on('admin_receive_message', params => {
  const divMessages = document.getElementById(`allMessages${params.user_id}`)
  const createDiv = document.createElement('div')
  createDiv.className = 'admin_message_client'
  createDiv.innerHTML = `${params.email}: <span>${params.message.text}</span>`
  createDiv.innerHTML += '<span class="admin_date">'
  createDiv.innerHTML += dayjs(params.message.created_at).format("DD/MM/YYYY HH:mm:ss")
  createDiv.innerHTML += '</span>'

  divMessages.appendChild(createDiv)
})

function call (id) {
  const connection = connectionsData.find(connection => connection.socket_id === id)
  const template = document.getElementById('admin_template').innerHTML

  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id
  })

  document.getElementById('supports').innerHTML += rendered

  const params = { user_id: connection.user_id }

  socket.emit('admin_list_messages_by_user', params, messages => {
    const divMessages = document.getElementById(`allMessages${connection.user_id}`)

    messages.forEach(message => {
      const createDiv = document.createElement('div')

      if (message.admin_id === null) {
        createDiv.className = 'admin_message_client'
        createDiv.innerHTML = `${connection.user.email}: <span>${message.text}</span>`
        createDiv.innerHTML += '<span class="admin_date">'
        createDiv.innerHTML += dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")
        createDiv.innerHTML += '</span>'
      } else {
        createDiv.className = 'admin_message_admin'
        createDiv.innerHTML = `Atendente: <span>${message.text}</span>`
        createDiv.innerHTML += '<span class="admin_date">'
        createDiv.innerHTML += dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")
        createDiv.innerHTML += '</span>'
      }

      divMessages.appendChild(createDiv)
    })
  })
}

function sendMessage (id) {
  const text = document.getElementById(`send_message_${id}`)

  const params = {
    text: text.value,
    user_id: id
  }

  socket.emit('admin_send_message', params)

  const divMessages = document.getElementById(`allMessages${id}`)
  const createDiv = document.createElement('div')
  createDiv.className = 'admin_message_admin'
  createDiv.innerHTML = `Atendente: <span>${params.text}</span>`
  createDiv.innerHTML += '<span class="admin_date">'
  createDiv.innerHTML += dayjs().format("DD/MM/YYYY HH:mm:ss")
  createDiv.innerHTML += '</span>'
  divMessages.appendChild(createDiv)

  text.value = ''
}