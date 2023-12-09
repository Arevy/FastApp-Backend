import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
    type Mutation {
        createAppointment(userId: ID!, serviceId: ID!, date: String!): Appointment
        updateAppointment(appointmentId: ID!, newDate: String!): Appointment
        deleteAppointment(appointmentId: ID!): DeleteResult
    }
  
    type Query {
        userAppointments(userId: ID!): [Appointment]
    }
    
    type DeleteResult {
        success: Boolean!
        message: String
    }
`;