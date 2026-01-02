const Role = require("../../models/Role");

async function seedRoles() {
  try {
    const count = await Role.countDocuments();
    if (count > 0) {
        console.log("Les roles existent deja dans la base de donnees.");
        return;
    }

    await Role.insertMany([
      { titre: "ADMIN", permission: ["CREATE", "READ", "UPDATE", "DELETE"] },
      { titre: "RECRUT", permission: ["CREATE", "READ"] },
      { titre: "CONSULTANT", permission: ["READ"] },
    ]);
  } catch (error) {
    console.error("Error seeding roles:", error);
  }
}

module.exports = seedRoles;
