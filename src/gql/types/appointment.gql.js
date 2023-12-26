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
        listAllAppointmentsShort: [Appointment]
        listAllAppointmentsFull: [Appointments]
    }
    
    type DeleteResult {
        success: Boolean!
        message: String
    }

    type Appointments{
        uuid: ID!
        user: User!
        service: Service!
        date: String!
        status: String!
    }

    type User{
        email: String!
        isAdmin: Boolean
        isActive: Boolean
        uuid: String!
        registrationDate: String!
        lastLogin: String
        userType: UserType!
    }
    
    type Service{
        serviceId: ID!
        name: String
        category: String
    } 
`;