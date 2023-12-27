import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
    type ServiceType {
        serviceId: ID
        name: String
        category: String
    }

    type Mutation {
        createService(name: String, category: String): ServiceType
        updateService(serviceId: ID!, name: String, category: String): ServiceType
        deleteService(serviceId: ID!): DeleteResult
    }

    type Query {
        serviceAppointments(serviceId: ID!): [Appointment]
        allAppointments: [Appointment]
        getService(serviceId: ID!): ServiceType
        listAllServices: [ServiceType]
    }

    type DeleteResult {
        success: Boolean!
        message: String
    }
    
    type User {
        uuid: String!
        email: String!
    }

    type Appointment {
        uuid: ID!
        userId: ID!
        serviceId: ID!
        date: String!
        status: String!
    }
`;