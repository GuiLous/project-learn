import { CommonEntity } from '@/common/entities';
import { Role } from '@/modules/role/entities';
import { Column, Entity, JoinTable, ManyToMany, Unique } from 'typeorm';
import { UserInterface } from '../interfaces';

@Entity({ name: 'users' })
@Unique(['username', 'email'])
export class User extends CommonEntity implements UserInterface {
  @Column({ type: 'text', nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'text', nullable: true, default: null })
  salt: string;

  @Column({ type: 'citext', nullable: false })
  firstName: string;

  @Column({ type: 'text', nullable: false })
  lastName: string;

  @Column({ type: 'text', nullable: false })
  email: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean;

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true,
  })
  @JoinTable()
  roles: Role[];
}
