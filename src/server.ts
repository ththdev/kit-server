import app from './app'
import { createConnection } from 'typeorm'

const PORT = 8080

createConnection()

app.listen(PORT, () => {
  console.log('Velog server is listening to port', PORT);
});