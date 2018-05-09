class Player {
  constructor(firstName, lastName, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
  
  setFirstName(input) {
    this.firstName = input;
    return this.firstName;
  }
  setLastName(input) {
    this.lastName = input;
    return this.lastName;
  }
  setEmail(input) {
    this.email = input;
    return this.email;
  }
  
  getPlayer() {
    return {
      'Name': this.firstName,
      'Last Name': this.lastName,
      'E-mail': this.email
    }
  }
}