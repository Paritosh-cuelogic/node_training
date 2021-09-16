const Employee = require("./model");

const oprations = async () => {
  try {
    // create new employee
    console.log("Creating new employee...");
    const emp = new Employee();
    emp.firstName = "Paritosh";
    emp.LastName = "Mahale";
    emp.email = "paritosh.mahale@cuelogic.com";
    emp.age = 28;
    emp.gender = "male";
    emp.isActive = true;
    const empResult = await emp.save();
    console.log(`New employee with name ${emp.firstName} created`);

    console.log("Updating employee name to Tushar");
    const model = await Employee.findById(empResult._id);
    model.firstName = "Tushar";
    const updateResult = await model.save();
    console.log(`Employee name updated to ${updateResult.firstName}`);

    console.log("Delete employee with the name Tushar");
    await Employee.deleteOne({ firstName: "Tushar" });
    console.log(`Employee with Tushar is deleted`);

    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

oprations();
