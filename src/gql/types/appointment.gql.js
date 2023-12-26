import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
    type Mutation {
        createAppointment(userId: ID!, serviceId: ID!, date: String!): Appointment
        updateAppointment(uuid: ID!, newDate: String, newStatus: String): Appointment
        deleteAppointment(uuid: ID!): DeleteResult
    }
  
    type Query {
        userAppointments(uuid: ID!): [Appointment]
        """ Get list of all Appointments on database """
        listAllAppointments: [Appointment]
    }
    
    type DeleteResult {
        success: Boolean!
        message: String
    }
`;