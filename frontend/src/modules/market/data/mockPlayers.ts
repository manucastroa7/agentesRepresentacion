import type { PlayerMarketData } from '../components/PlayerMarketCard';

export const MOCK_PLAYERS: PlayerMarketData[] = [
    {
        id: '1',
        firstName: 'Lionel',
        lastName: 'Messi',
        position: 'Delantero',
        nationality: 'ARG',
        age: 36,
        height: 170,
        weight: 72,
        foot: 'Izquierdo',
        club: 'Inter Miami',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
        agencyName: 'Leo Messi Management',
        agencyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png', // Placeholder
        videoUrl: 'https://www.youtube.com/watch?v=PSanJ5swYBM',
        contractStatus: 'Con Contrato',
        marketValue: '35M'
    },
    {
        id: '2',
        firstName: 'Julián',
        lastName: 'Álvarez',
        position: 'Delantero',
        nationality: 'ARG',
        age: 24,
        height: 170,
        weight: 71,
        foot: 'Derecho',
        club: 'Manchester City',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Juli%C3%A1n_%C3%81lvarez_2022.jpg/800px-Juli%C3%A1n_%C3%81lvarez_2022.jpg',
        agencyName: 'Fernando Hidalgo',
        agencyLogo: '',
        videoUrl: 'https://www.youtube.com/watch?v=PSanJ5swYBM', // Placeholder ID
        contractStatus: 'Con Contrato',
        marketValue: '90M'
    },
    {
        id: '3',
        firstName: 'Enzo',
        lastName: 'Fernández',
        position: 'Mediocampista',
        nationality: 'ARG',
        age: 23,
        height: 178,
        weight: 76,
        foot: 'Derecho',
        club: 'Chelsea FC',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Enzo_Fern%C3%A1ndez_2022.jpg/640px-Enzo_Fern%C3%A1ndez_2022.jpg',
        agencyName: 'Uriel Pérez',
        agencyLogo: '',
        videoUrl: 'https://www.youtube.com/watch?v=PSanJ5swYBM', // Placeholder ID
        contractStatus: 'Con Contrato',
        marketValue: '80M'
    },
    {
        id: '4',
        firstName: 'Emiliano',
        lastName: 'Martínez',
        position: 'Arquero',
        nationality: 'ARG',
        age: 31,
        height: 195,
        weight: 88,
        foot: 'Derecho',
        club: 'Aston Villa',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Emiliano_Mart%C3%ADnez_2022.jpg/640px-Emiliano_Mart%C3%ADnez_2022.jpg',
        agencyName: 'Gustavo Goñi',
        agencyLogo: '',
        videoUrl: 'https://www.youtube.com/watch?v=PSanJ5swYBM', // Placeholder ID
        contractStatus: 'Con Contrato',
        marketValue: '28M'
    },
    {
        id: '5',
        firstName: 'Valentín',
        lastName: 'Barco',
        position: 'Defensor',
        nationality: 'ARG',
        age: 19,
        height: 172,
        weight: 68,
        foot: 'Izquierdo',
        club: 'Brighton & Hove Albion',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Valentin_Barco.jpg/640px-Valentin_Barco.jpg',
        agencyName: 'Roucco',
        agencyLogo: '',
        videoUrl: 'https://www.youtube.com/watch?v=PSanJ5swYBM', // Placeholder ID
        contractStatus: 'Con Contrato',
        marketValue: '13M'
    },
    {
        id: '6',
        firstName: 'Santiago',
        lastName: 'López',
        position: 'Delantero',
        nationality: 'ARG',
        age: 18,
        height: 175,
        weight: 70,
        foot: 'Derecho',
        club: 'Independiente',
        avatarUrl: '', // Test placeholder
        agencyName: 'Tomas Deipenau',
        agencyLogo: '',
        videoUrl: 'https://www.youtube.com/watch?v=PSanJ5swYBM', // Placeholder ID
        contractStatus: 'Libre',
        marketValue: '500K'
    }
];
