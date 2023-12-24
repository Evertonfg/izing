import { CadastrarEmpresa } from '../../service/login'
import { Notify } from 'quasar'

const cadastro = {
  state: {
    token: null,
    isAdmin: false,
    isSuporte: false
  },

  actions: {

    async CadastroLogin ({ commit, dispatch }, user) {
      user.email = user.email.trim()
      try {
        const { data } = await CadastrarEmpresa(user)
        if (data.error === 'An user with this email already exists.') {
          Notify.create({
            type: 'positive',
            message: 'E-mail já cadastrado , verifique o seu e-mail!',
            position: 'top',
            progress: true
          })
        } else {
          Notify.create({
            type: 'positive',
            message: 'Usuário cadastrado com sucesso!!!',
            position: 'top',
            progress: true
          })
          this.$router.push({
            name: '/'
          })
        }
      } catch (error) {
        Notify.create({
          type: 'positive',
          message: 'E-mail já cadastrado , verifique seu e-mail!',
          position: 'top',
          progress: true
        })
        console.error(error)
      }
    }
  }
}

export default cadastro
