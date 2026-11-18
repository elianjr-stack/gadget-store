import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile') getProfile(@CurrentUser('sub') userId: string) { return this.usersService.getProfile(userId); }
  @Patch('profile') updateProfile(@CurrentUser('sub') userId: string, @Body() dto: any) { return this.usersService.updateProfile(userId, dto); }
  @Post('change-password') changePassword(@CurrentUser('sub') userId: string, @Body() body: { oldPassword: string; newPassword: string }) {
    return this.usersService.changePassword(userId, body.oldPassword, body.newPassword);
  }

  @Get('addresses') getAddresses(@CurrentUser('sub') userId: string) { return this.usersService.getAddresses(userId); }
  @Post('addresses') createAddress(@CurrentUser('sub') userId: string, @Body() dto: any) { return this.usersService.createAddress(userId, dto); }
  @Patch('addresses/:id') updateAddress(@CurrentUser('sub') userId: string, @Param('id') id: string, @Body() dto: any) { return this.usersService.updateAddress(userId, id, dto); }
  @Delete('addresses/:id') deleteAddress(@CurrentUser('sub') userId: string, @Param('id') id: string) { return this.usersService.deleteAddress(userId, id); }

  // Admin endpoints
  @UseGuards(RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER)
  @Get() getAllUsers(@Query('page') page = '1', @Query('limit') limit = '20', @Query('search') search?: string, @Query('role') role?: string) {
    return this.usersService.getAllUsers(+page, +limit, search, role);
  }

  @UseGuards(RolesGuard) @Roles(UserRole.OWNER)
  @Patch(':id/role') updateRole(@Param('id') id: string, @Body('role') role: string) { return this.usersService.updateUserRole(id, role); }

  @UseGuards(RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER)
  @Patch(':id/toggle-active') toggleActive(@Param('id') id: string) { return this.usersService.toggleUserActive(id); }

  @UseGuards(RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER)
  @Get('activity-logs') getActivityLogs(@Query('page') page = '1', @Query('limit') limit = '20', @Query('userId') userId?: string) {
    return this.usersService.getActivityLogs(+page, +limit, userId);
  }
}
