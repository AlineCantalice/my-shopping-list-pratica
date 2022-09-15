import { faker } from "@faker-js/faker";

export function createItems() {
    return {
        title: faker.lorem.word(2),
        url: faker.internet.url(),
        description: faker.lorem.paragraph(1),
        amount: faker.datatype.number({ max: 100 })
    }
}

export function createId() {
    return faker.datatype.number({ max: 5 });
}