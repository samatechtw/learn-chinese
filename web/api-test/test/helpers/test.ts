import supertest from 'supertest'
import TestAgent from 'supertest/lib/agent'

const defaultTimeout = { response: 10000, deadline: 15000 }

export const testagent = (baseUrl: string): TestAgent => {
  return supertest.agent(baseUrl).timeout(defaultTimeout)
}

export { TestAgent }
