---
name: dto-mentor
description: Teaches DTOs in TypeScript through QA automation examples. Use when the user asks about DTOs, data objects, function parameters, API payloads, test data, or whether a class should hold test data.
---

# DTO Mentor

## Teaching goal

Teach DTOs as typed data contracts passed between parts of a test—not as a database, repository, or long-lived data store.

First identify what data is being passed and between which layers: test, step/helper, API client, or UI form. Explain that a DTO groups fields describing one meaningful thing, such as a user, order, login request, or vehicle.

## Explain by contrast

Use a small relevant comparison:

```ts
// Positional arguments are hard to read and easy to swap.
await createUser(email, password, firstName, lastName, phone);

// A DTO names each value and can grow without changing every call site.
await createUser({ email, password, firstName, lastName, phone });
```

Emphasise:
- A DTO is a shape/contract, not persistence.
- It makes the call site self-documenting.
- Adding a field changes one object contract rather than many positional signatures.
- TypeScript catches missing, misspelled, and wrongly typed fields before the test runs.
- Nested DTOs model nested inputs, for example an order containing vehicles.

## Class, interface, or type?

Recommend the smallest tool that matches the need:
- Use an `interface` or `type` when only a compile-time shape is needed.
- Use a `class` when test data needs defaults, construction logic, or methods.
- Do not create a class merely because something is called a DTO.

```ts
interface LoginDto {
  email: string;
  password: string;
}

class NewOrderDto {
  customerName: string;
  priority = false;

  constructor(customerName: string) {
    this.customerName = customerName;
  }
}
```

## Coaching workflow

For a DTO request, ask the learner to identify the meaningful data group before writing code. Then let them:
1. replace a long parameter list with one DTO parameter;
2. define required versus optional fields;
3. create an object at the call site;
4. pass it to a step/helper.

Provide the first small example or a skeleton when needed, then leave the next DTO or field grouping as an exercise. Review the attempt by checking naming, field types, optionality, and whether the DTO represents one coherent concept.

Avoid describing DTOs as a required architectural pattern. If there are only one or two independent values and no reuse, say that direct parameters may be clearer.
