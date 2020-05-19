
export default class Dataset {
    constructor () {
        this.data = null;
    }
    get numFeatures(){
        if (this.data == null) {
            throw new Error('\'loadData()\' must be called before numFeatures')
        }
        return Object.keys(this.data[0]).length - 5;
    }
    async loadData() {
        // const response = await fetch("http://localhost/api/admission");
        const response = await fetch("http://kemakom.cs.upi.edu/api/admission");
        const json = await response.json();
        [this.data] = [json.data];
    }
}