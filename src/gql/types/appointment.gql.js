import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
    type Mutation {
        createAppointment(uuid: ID!, serviceId: ID!, date: String!): Appointment
        updateAppointment(appointmentId: ID!, newDate: String!): Appointment
        deleteAppointment(appointmentId: ID!): DeleteResult
    }
  
    type Query {
        userAppointments(uuid: ID!): [Appointment]
    }
    
    type DeleteResult {
        success: Boolean!
        message: String
    }
`;