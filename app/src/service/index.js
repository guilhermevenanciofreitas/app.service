import axios from "axios";
import Swal from 'sweetalert2'

export class Service {

    Post = async (url, data, headers, isSwal = true) => {

        const env = import.meta.env.VITE_API_URL
        const api_url = env + url

        let config = {}

        let authorization = JSON.parse(localStorage.getItem('Authorization'))

        try {

            if (authorization) {
                config = {
                    headers: {
                        'Authorization': `${authorization?.token}`,
                        ...headers
                    },
                }
            }

            var response = await axios.post(api_url, data || {}, config)

            if (authorization) {
                authorization.lastAcess = response.headers['last-acess']
                authorization.expireIn = parseInt(response.headers['expire-in'])
                localStorage.setItem('Authorization', JSON.stringify(authorization))
            }

            return response

        } catch (error) {

            //API fora do ar
            if (error.code == 'ERR_NETWORK') {
                const message = '[300] - Servidor fora do ar!'
                Swal.fire({showCloseButton: true, title: 'Ops...', icon: 'error', text: message})
                throw new Error(message)
            }

            //Em manutenção
            if (error?.response?.status == 301) {
                const message = '[301] - Servidor em manutenção, aguarde um instante!'
                Swal.fire({showCloseButton: true, title: 'Ops...', icon: 'warning', text: message, confirmButtonColor: "#FFF", confirmButtonText: 'Aguarde um instante'})
                throw new Error(message)
            }

            //Sessão expirada
            if (error?.response?.status == 400) {
                const message = error.response.data.message
                localStorage.removeItem('Authorization')
                const redirect = window.location.pathname == '/' ? '' : `?redirect=${window.location.pathname}`
                window.location.href = `/sign-in${redirect}`
                throw new Error(message)
            }

            //Em manutenção
            if (error?.response?.status == 404) {
                const message = `[404] - Route "${url}"!`
                if (isSwal) {
                    Swal.fire({showCloseButton: true, title: 'Ops...', icon: 'warning', text: message, confirmButtonColor: "#FFF", confirmButtonText: '<span style="color: rgba(88, 86, 214)">OK</span>'})
                }
                throw new Error(message)
            }

            //Erro desconhecido
            const message = '[500] - Ocorreu um erro inesperado!'
            if (isSwal) {
                Swal.fire({showCloseButton: true, title: 'Ops...', icon: 'error', text: message, confirmButtonColor: "#FFF", confirmButtonText: '<span style="color: rgba(88, 86, 214)">Quero abrir um chamado!</span>',
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire('', 'Chamado <b>#49812</b> aberto com sucesso!', 'success')
                    }
                })
            }
            throw new Error(JSON.stringify(error?.response?.data))

        }
    }

}