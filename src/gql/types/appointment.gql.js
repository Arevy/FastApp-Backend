import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
  type Mutation {
    createAppointment(userId: ID!, serviceId: ID!, date: String!): Appointment
    updateAppointment(_id: ID!, newDate: String, newStatus: String): Appointment
    deleteAppointment(_id: ID!): DeleteResult
  }

  type Query {
    userAppointments(userId: ID!): [Appointment]
    """
    Get list of all Appointments on database
    """
    listAllAppointmentsShort: [Appointment]
    listAllAppointmentsFull: [AppointmentDetails]
    listAllAppointmentsById: [Appointment]
    listAllAppointments: [Appointment]
  }

  type DeleteResult {
    success: Boolean!
    message: String
  }

  type AppointmentDetails {
    _id: ID!
    user: User
    service: Service
    date: String!
    status: String!
  }

  type Appointment {
    _id: ID!
    user: User
    service: Service
    date: String!
    status: String!
  }

  type User {
    _id: ID!
    email: String!
    isAdmin: Boolean
    isActive: Boolean
    registrationDate: String
    lastLogin: String
    userType: UserType
  }

  type Service {
    _id: ID!
    name: String
    category: String
    isActive: Boolean
  }

  enum UserType {
    SERVICE_USER
    ADMIN_USER
    NORMAL_USER
  }
`;
