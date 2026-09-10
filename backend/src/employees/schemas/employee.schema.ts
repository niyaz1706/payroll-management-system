import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmployeeDocument = HydratedDocument<Employee>;

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TERMINATED = 'TERMINATED',
}

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true, min: 0 })
  baseSalary: number;

  @Prop({ required: true, enum: EmployeeStatus, default: EmployeeStatus.ACTIVE })
  status: EmployeeStatus;

  @Prop({ required: true })
  hireDate: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);