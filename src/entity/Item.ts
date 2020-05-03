import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    OneToMany,
    ManyToOne
} from 'typeorm'
import User from './User'
import Collection from './Collection'

@Entity()
export default class Item extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    name!: string

    @Column()
    price: number

    @Column()
    brand: string

    @Column("simple-array", { nullable: true })
    imageUrls: string[]

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date
	
	@Column("uuid")
	creator_id!: string
	
	@ManyToOne(type => Collection, collection => collection.items, { cascade: true, onDelete: "CASCADE" })
	collection: Collection
}