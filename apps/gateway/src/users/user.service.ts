import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async upsertAuthUser(input: {
    clerkuserId: string;
    email: string;
    name: string;
  }) {
    const now = new Date();
    return await this.userModel.findOneAndUpdate(
      { clerkUserId: input.clerkuserId },
      {
        $set: {
          email: input.email,
          name: input.name,
          lastSeenAt: now,
          createdAt:now
        },
        $setOnInsert:{
            role:'user'
        }
      },
      {new:true,upsert:true}
    );
  }
  
  async findByClerkuserId(clerkUserId:string){
    return await this.userModel.findOne({clerkUserId})
  }
}
