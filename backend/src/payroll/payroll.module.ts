import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { Payroll, PayrollSchema } from './schemas/payroll.schema';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payroll.name, schema: PayrollSchema }]),
    EmployeesModule,
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}