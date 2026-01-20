import { Expose, Transform } from 'class-transformer';

export class PublicPlayerCardDto {
    @Expose()
    id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    @Transform(({ obj }) => `${obj.firstName} ${obj.lastName}`)
    fullName: string;

    @Expose()
    @Transform(({ obj }) => obj.avatarUrl)
    photo: string;

    @Expose()
    position: string;

    @Expose()
    nationality: string;

    @Expose()
    height: number;

    @Expose()
    foot: string;

    @Expose()
    @Transform(({ obj }) => obj.agent?.agencyName || 'Agente Independiente')
    agencyName: string;

    @Expose()
    contractStatus: string;

    @Expose()
    @Transform(({ obj }) => {
        if (!obj.birthDate) return null;
        const birthDate = new Date(obj.birthDate);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    })
    age: number;
}
