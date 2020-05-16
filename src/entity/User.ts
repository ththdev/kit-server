import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
	OneToMany,
	UpdateDateColumn
} from 'typeorm'
import Kit from './Kit'
import jwt from 'jsonwebtoken'

@Entity()
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    name!: string
	
	@Column({ nullable: true })
    email: string

    @Column({ nullable: true })
    password: string
	
	@Column({ nullable: true, default: false })
    isAdmin: boolean
	
	@Column({ nullable: true })
    profileImage: string
	
	@Column({ nullable: true })
    googleId: string

    @Column({ nullable: true })
    kakaoId: string

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date
	
	@UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date
	
	@OneToMany(type => Kit, kit => kit.member, { cascade: true, onDelete: 'CASCADE' })
    Kits: Kit[];

}