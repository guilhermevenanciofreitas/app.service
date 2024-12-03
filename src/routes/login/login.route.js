import { Router } from 'express'

const router = Router()

router.get('/sign-in', (req, res) => res.json({ message: 'Login bem-sucedido' }))

export default router