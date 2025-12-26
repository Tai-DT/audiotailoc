
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const SAMPLE_PROJECTS = [
    {
        name: 'Home Audio Setup - Modern Villa',
        slug: 'home-audio-setup-modern-villa',
        client: 'Mr. Nguyen Van A',
        category: 'Home Audio',
        description: 'Complete audio system installation for a 500m2 modern villa in Thao Dien. Featuring high-end KEF speakers and Marantz amplifiers.',
        shortDescription: 'High-end audio setup for luxury villa.',
        technologies: 'KEF, Marantz, Denon, Acoustic treatment',
        thumbnailImage: 'https://placehold.co/800x600/1a1a1a/FFF?text=Villa+Audio+Setup',
        coverImage: 'https://placehold.co/1920x1080/1a1a1a/FFF?text=Villa+Audio+Setup+Cover',
        status: 'COMPLETED',
        isActive: true,
        isFeatured: true,
        viewCount: 150,
        completionDate: new Date( '2024-01-15' ),
        metaTitle: 'Luxury Home Audio Installation | Audio Tai Loc Project',
        metaDescription: 'Explore our latest high-end audio installation project at a modern villa in Thao Dien. Professional sound system design and setup by Audio Tai Loc.',
        metaKeywords: 'home audio, kef speakers, villa audio setup, am thnah biet thu',
        ogTitle: 'Luxury Home Audio Setup - Modern Villa',
        ogDescription: 'See how we transformed this villa with cinema-quality sound.',
        ogImage: 'https://placehold.co/1200x630/1a1a1a/FFF?text=Villa+Audio+OG',
        userId: 'cefb0ea8-7890-4f4a-893b-b0b869e1e096', // Admin ID
        displayOrder: 1
    },
    {
        name: 'Karaoke System - Luxury Lounge',
        slug: 'karaoke-system-luxury-lounge',
        client: 'Sky Bar HCMC',
        category: 'Commercial Audio',
        description: 'Professional karaoke system for a VIP lounge. Includes JBL professional series speakers, digital processing, and soundproofing.',
        shortDescription: 'VIP Karaoke system for Sky Bar.',
        technologies: 'JBL Pro, Crown Amps, Shure Mics',
        thumbnailImage: 'https://placehold.co/800x600/4a1a1a/FFF?text=Karaoke+Lounge',
        coverImage: 'https://placehold.co/1920x1080/4a1a1a/FFF?text=Karaoke+Lounge+Cover',
        status: 'COMPLETED',
        isActive: true,
        isFeatured: true,
        viewCount: 320,
        completionDate: new Date( '2024-03-20' ),
        metaTitle: 'Professional Karaoke System Installation | Audio Tai Loc',
        metaDescription: 'Case study: Installing a top-tier karaoke system for Sky Bar HCMC. JBL Pro speakers and digital sound processing.',
        metaKeywords: 'karaoke system, jbl pro, vip lounge audio, am thanh karaoke',
        ogTitle: 'VIP Lounge Karaoke Setup',
        ogDescription: 'Experience the ultimate karaoke sound system at Sky Bar.',
        ogImage: 'https://placehold.co/1200x630/4a1a1a/FFF?text=Karaoke+OG',
        userId: 'cefb0ea8-7890-4f4a-893b-b0b869e1e096',
        displayOrder: 2
    },
    {
        name: 'Car Audio Upgrade - Mercedes GLC',
        slug: 'car-audio-upgrade-mercedes-glc',
        client: 'Ms. Le Thi B',
        category: 'Car Audio',
        description: 'Full audio system upgrade for Mercedes GLC 300. Replacing stock speakers with Burmester surround sound system and adding subwoofer.',
        shortDescription: 'Premium car audio upgrade for Mercedes.',
        technologies: 'Burmester, DSP Tuning, Sound Damping',
        thumbnailImage: 'https://placehold.co/800x600/1a2a4a/FFF?text=Mercedes+Audio',
        coverImage: 'https://placehold.co/1920x1080/1a2a4a/FFF?text=Mercedes+Audio+Cover',
        status: 'COMPLETED',
        isActive: true,
        isFeatured: false,
        viewCount: 95,
        completionDate: new Date( '2024-02-10' ),
        metaTitle: 'Mercedes GLC Audio Upgrade | Audio Tai Loc',
        metaDescription: 'Upgrading stock Mercedes audio to premium Burmester system. Professional installation and tuning.',
        metaKeywords: 'car audio, mercedes glc audio, burmester retrofit, nang cap am thanh xe hoi',
        ogTitle: 'Mercedes GLC 300 Audio Upgrade',
        ogDescription: 'Transforming the driving experience with premium sound.',
        ogImage: 'https://placehold.co/1200x630/1a2a4a/FFF?text=Car+Audio+OG',
        userId: 'cefb0ea8-7890-4f4a-893b-b0b869e1e096',
        displayOrder: 3
    }
];

async function main ()
{
    console.log( '🧹 Cleaning up old projects...' );
    await prisma.projects.deleteMany( {} );
    console.log( '✅ Old projects deleted.' );

    console.log( '🌱 Seeding new sample projects...' );

    for ( const project of SAMPLE_PROJECTS )
    {
        const { userId, ...rest } = project;
        // We need to make sure the user exists, otherwise fallback to finding the first admin or creating one?
        // In this env, we know 'cefb0ea8-7890-4f4a-893b-b0b869e1e096' seems to be the admin ID from previous logs.
        // Let's check if it exists first.
        let finalUserId = userId;
        const admin = await prisma.users.findUnique( { where: { id: userId } } );

        if ( !admin )
        {
            console.log( `User ${ userId } not found. Fetching first admin...` );
            const firstAdmin = await prisma.users.findFirst( { where: { role: 'ADMIN' } } );
            if ( firstAdmin )
            {
                finalUserId = firstAdmin.id;
            } else
            {
                console.error( 'No admin user found to assign projects to. Aborting.' );
                return;
            }
        }

        await prisma.projects.create( {
            data: {
                id: randomUUID(),
                ...rest,
                userId: finalUserId,
                updatedAt: new Date(),
            }
        } );
        console.log( `Created project: ${ project.name }` );
    }

    console.log( '✨ Data seeding completed successfully!' );
}

main()
    .catch( ( e ) =>
    {
        console.error( e );
        process.exit( 1 );
    } )
    .finally( async () =>
    {
        await prisma.$disconnect();
    } );
