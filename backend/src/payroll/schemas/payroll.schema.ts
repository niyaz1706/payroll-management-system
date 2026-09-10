import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Employee } from '../../employees/schemas/employee.schema';

export type PayrollDocument = HydratedDocument<Payroll>;

export enum PayrollStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  PAID = 'PAID',
}

@Schema({ timestamps: true })
export class Payroll {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Employee.name, required: true })
  employee: Employee;

  @Prop({ required: true })
  payPeriodStart: Date;

  @Prop({ required: true })
  payPeriodEnd: Date;

  @Prop({ required: true, min: 0 })
  baseSalary: number;

  @Prop({ default: 0, min: 0 })
  bonus: number;

  @Prop({ default: 0, min: 0 })
  allowances: number;

  @Prop({ default: 0, min: 0 })
  deductions: number;

  @Prop({ default: 0, min: 0 })
  tax: number;

  @Prop({ required: true, min: 0 })
  netPay: number;

  @Prop({ required: true, enum: PayrollStatus, default: PayrollStatus.PENDING })
  status: PayrollStatus;
}

export const PayrollSchema = SchemaFactory.createForClass(Payroll);