import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
	OneToMany,
	ManyToMany,
	ManyToOne
} from 'typeorm'
import User from './User'
import Item from './Item'

@Entity()
export default class Collection extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    name: string

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date
	
	@Column("uuid")
	creator_id!: string
	
	@ManyToOne(type => User, user => user.collections, { onDelete: 'CASCADE' })
    member: User

	@OneToMany(type => Item, item => item.collection)
	items: Item[]
}