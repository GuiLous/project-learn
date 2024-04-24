import { CommonEntity } from '@/common/entities';
import { User } from '@/modules/user/entities';
import { Column, Entity, ManyToMany, Unique } from 'typeorm';

@Entity({ name: 'roles' })
@Unique(['name'])
export class Role extends CommonEntity {
  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles, {})
  users: User[];
}
