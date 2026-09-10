import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Payroll, PayrollDocument } from './schemas/payroll.schema';
import { EmployeesService } from '../employees/employees.service';
import { EmployeeDocument } from '../employees/schemas/employee.schema';

@Injectable()
export class PayrollService {
  constructor(
    @InjectModel(Payroll.name)
    private payrollModel: Model<PayrollDocument>,
    private readonly employeesService: EmployeesService,
  ) {}

  async create(createPayrollDto: CreatePayrollDto): Promise<Payroll> {
    const employee = (await this.employeesService.findOne(
      createPayrollDto.employeeId,
    )) as EmployeeDocument;

    const baseSalary = employee.baseSalary;
    const bonus = createPayrollDto.bonus ?? 0;
    const allowances = createPayrollDto.allowances ?? 0;
    const deductions = createPayrollDto.deductions ?? 0;
    const tax = createPayrollDto.tax ?? 0;

    const netPay = baseSalary + bonus + allowances - (deductions + tax);

    const newPayroll = new this.payrollModel({
      ...createPayrollDto,
      employee: employee._id,
      baseSalary,
      bonus,
      allowances,
      deductions,
      tax,
      netPay,
    });

    return newPayroll.save();
  }

  async findAll(): Promise<Payroll[]> {
    return this.payrollModel.find().populate('employee').exec();
  }

  async findOne(id: string): Promise<Payroll> {
    const payroll = await this.payrollModel
      .findById(id)
      .populate('employee')
      .exec();
    if (!payroll) {
      throw new NotFoundException(`Payroll record with ID ${id} not found`);
    }
    return payroll;
  }

  async findByEmployee(employeeId: string): Promise<Payroll[]> {
    return this.payrollModel
      .find({ employee: new Types.ObjectId(employeeId) as any })
      .populate('employee')
      .exec();
  }

  async update(
    id: string,
    updatePayrollDto: UpdatePayrollDto,
  ): Promise<Payroll> {
    const existing = await this.payrollModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException(`Payroll record with ID ${id} not found`);
    }

    const baseSalary = existing.baseSalary;
    const bonus = updatePayrollDto.bonus ?? existing.bonus;
    const allowances = updatePayrollDto.allowances ?? existing.allowances;
    const deductions = updatePayrollDto.deductions ?? existing.deductions;
    const tax = updatePayrollDto.tax ?? existing.tax;

    const netPay = baseSalary + bonus + allowances - (deductions + tax);

    const updated = await this.payrollModel
      .findByIdAndUpdate(
        id,
        { ...updatePayrollDto, netPay },
        { new: true },
      )
      .populate('employee')
      .exec();

    if (!updated) {
      throw new NotFoundException(`Payroll record with ID ${id} not found`);
    }

    return updated;
  }

  async remove(id: string): Promise<Payroll> {
    const deleted = await this.payrollModel
      .findByIdAndDelete(id)
      .populate('employee')
      .exec();
    if (!deleted) {
      throw new NotFoundException(`Payroll record with ID ${id} not found`);
    }
    return deleted;
  }
}