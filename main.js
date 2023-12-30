

document.addEventListener("DOMContentLoaded", () => {

    const flexyDashboard = document.querySelector("#flexyDashboard");

    function addLine(){
        //Create a new content line with empty data
        //Replace the text contents with the default values you want
        const newLine = document.createElement("div");
        newLine.classList.add("line");

        const nameSquare = document.createElement("div");
        nameSquare.classList.add("content");
        nameSquare.textContent = "...";

        const firstnameSquare = document.createElement("div");
        firstnameSquare.classList.add("content");
        firstnameSquare.textContent = "...";

        const directionSquare = document.createElement("div");
        directionSquare.classList.add("content");
        directionSquare.textContent = "...";

        const countrySquare = document.createElement("div");
        countrySquare.classList.add("content");
        countrySquare.textContent = "...";

        const phoneSquare = document.createElement("div");
        phoneSquare.classList.add("content");
        phoneSquare.textContent = "...";

        const moveBtn = document.createElement("div");
        moveBtn.classList.add("moveBtn");
        moveBtn.textContent = "↕";

        const deleteBtn = document.createElement("div");
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.textContent = "X";

        newLine.appendChild(moveBtn);
        newLine.appendChild(nameSquare);
        newLine.appendChild(firstnameSquare);
        newLine.appendChild(directionSquare);
        newLine.appendChild(countrySquare);
        newLine.appendChild(phoneSquare);
        newLine.appendChild(deleteBtn);
        
        addEventsToLine(newLine);
        document.querySelector(".body").appendChild(newLine);
    }

    function removeLine(e){
        //Yes, it's that easy
        e.target.parentElement.remove();
    }

    function addEventsToLine(line){
        let divs = line.querySelectorAll(".content");
        divs.forEach(el => {
            //On double click, we allow user to change the targeted value
            el.addEventListener('dblclick', changeValue);
        });
        line.querySelector(".moveBtn").addEventListener("mousedown", setMoveLine)
        line.querySelector(".deleteBtn").addEventListener("click", removeLine)
    }

    function setValue(input, cell){
        cell.textContent = input.value;
        input.remove();
        setChangeMode();
    }

    function changeValue(e){
        // Clean other inputs to prevent double modifications
        document.querySelectorAll(".newValueInput").forEach(el => { setValue(el,el.parentElement) });

        // Add an input over the targeted cell
        const input = document.createElement("input");
        input.classList.add("newValueInput");
        input.setAttribute("type","text");
        input.setAttribute("autofocus", "");
        input.value = e.target.textContent;
        input.addEventListener("blur", function() {
            setValue(input, e.target)
        });
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              setValue(input, e.target);
            }
        });
        e.target.appendChild(input);
    }

    function setMoveLine(e){
        //Aim for the target line, and add moving class which makes the line absolute until setLine is fired
        let line = e.target.parentElement;
        line.classList.add("moving");
        document.addEventListener("mouseup", setLine);
        line.addEventListener("mousemove", function moveListener(e){
            e.preventDefault();
            let body = document.getElementsByClassName("body");
            let bodyTop = body[0].getBoundingClientRect().top;
            moveLine(e, bodyTop);
        });
        setChangeMode()
    }

    function moveLine(e, bodyTop){
        const line = document.getElementsByClassName("moving");
        const lineHeight = line[0].getBoundingClientRect().height;
        const linesX = document.querySelectorAll(".line:not(.moving)");
        const top = e.clientY - lineHeight / 2 - bodyTop;
        const landingLine = document.createElement("div");
        landingLine.classList.add("landingLine");
        //newpos is here to find after which line the content will be put
        let newPos = Math.round(top / lineHeight);
        if(document.querySelector(".landingLine")){
            document.querySelector(".landingLine").remove();
        }

        if(newPos > linesX.length){ newPos = linesX.length; }
        if(newPos < 0){ newPos = 0; }
        if(newPos == 0){
            linesX[0].before(landingLine);
        }else{
            linesX[newPos - 1].after(landingLine);
        }
        line[0].style.top = top + "px";
    }

    function setLine(e){
        const line = document.querySelector(".moving");
        const body = document.getElementsByClassName("body");
        const bodyTop = body[0].getBoundingClientRect().top;
        const lineHeight = line.getBoundingClientRect().height;
        const linesX = document.querySelectorAll(".line:not(.moving)");
        const top = e.clientY - bodyTop;
        let newPos = Math.round(top / lineHeight);
        if(newPos > linesX.length){
            newPos = linesX.length;
        }
        if(newPos < 0){
            newPos = 0;
        }

        const contents = line.querySelectorAll(".content");

        const newLine = document.createElement("div");
        newLine.classList.add("line");

        const nameSquare = document.createElement("div");
        nameSquare.classList.add("content");
        nameSquare.textContent = contents[0].textContent;

        const firstnameSquare = document.createElement("div");
        firstnameSquare.classList.add("content");
        firstnameSquare.textContent = contents[1].textContent;

        const directionSquare = document.createElement("div");
        directionSquare.classList.add("content");
        directionSquare.textContent = contents[2].textContent;

        const countrySquare = document.createElement("div");
        countrySquare.classList.add("content");
        countrySquare.textContent = contents[3].textContent;

        const phoneSquare = document.createElement("div");
        phoneSquare.classList.add("content");
        phoneSquare.textContent = contents[4].textContent;

        const moveBtn = document.createElement("div");
        moveBtn.classList.add("moveBtn");
        moveBtn.textContent = "↕";

        const deleteBtn = document.createElement("div");
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.textContent = "X";

        newLine.appendChild(moveBtn);
        newLine.appendChild(nameSquare);
        newLine.appendChild(firstnameSquare);
        newLine.appendChild(directionSquare);
        newLine.appendChild(countrySquare);
        newLine.appendChild(phoneSquare);
        newLine.appendChild(deleteBtn);
        
        addEventsToLine(newLine);
        if(newPos == 0){
            linesX[0].before(newLine);
        }else{
            linesX[newPos - 1].after(newLine);
        }

        if(document.querySelector(".landingLine")){
            document.querySelector(".landingLine").remove();
        }
        
        document.removeEventListener("mouseup", setLine);
        line.remove();
        setChangeMode();
    }

    function setChangeMode(){
        //Whenever the user changes something, he could want to save the array
        const saveBtn = document.querySelector(".saveBtn");
        saveBtn.classList.add("unlocked");
        saveBtn.addEventListener("click", saveArray);
    }

    function saveArray(){
        const lines = document.querySelectorAll('.line');
        const newValues = [];
        lines.forEach(line => {
            divs = line.querySelectorAll(".content");
            let obj = {
                'name' : divs[0].textContent,
                'firstname' : divs[1].textContent,
                'direction' : divs[2].textContent,
                'city' : divs[3].textContent,
                'phone' : divs[4].textContent
            };
            newValues.push(obj);
        });
        //newValues contains the updated data, now it's up to you to send it to your backend and save it
        console.log(newValues);
        window.alert("You just clicked the save button. To use it in your project, you need to change the saveArray function to link it to your database. For now you can find the data to save in the console.")
    }

    function startArray(){
        //Container
        const table = document.createElement("div");
        table.classList.add("container");

        //Header
        const header = document.createElement("div");
        header.classList.add("header");

        const nameHeader = document.createElement("div");
        nameHeader.classList.add("headerContent");
        nameHeader.textContent = "Name";

        const firstnameHeader = document.createElement("div");
        firstnameHeader.classList.add("headerContent");
        firstnameHeader.textContent = "Firstame";
        
        const directionHeader = document.createElement("div");
        directionHeader.classList.add("headerContent");
        directionHeader.textContent = "City";

        const countryHeader = document.createElement("div");
        countryHeader.classList.add("headerContent");
        countryHeader.textContent = "Country";

        const phoneHeader = document.createElement("div");
        phoneHeader.classList.add("headerContent");
        phoneHeader.textContent = "Phone";

        const moveBtnHeader = document.createElement("div");
        moveBtnHeader.classList.add("emptyCell")
        moveBtnHeader.textContent = "";

        const deleteBtnHeader = document.createElement("div");
        deleteBtnHeader.classList.add("emptyCell")
        deleteBtnHeader.textContent = "";

        header.appendChild(moveBtnHeader);
        header.appendChild(nameHeader);
        header.appendChild(firstnameHeader);
        header.appendChild(directionHeader);
        header.appendChild(countryHeader);
        header.appendChild(phoneHeader);
        header.appendChild(deleteBtnHeader);

        table.appendChild(header);

        //Body
        const body = document.createElement("div");
        body.classList.add("body");
        for (const line of sampleData) {
            const newLine = document.createElement("div");
            newLine.classList.add("line");

            const nameSquare = document.createElement("div");
            nameSquare.classList.add("content");
            nameSquare.textContent = line.name;

            const firstnameSquare = document.createElement("div");
            firstnameSquare.classList.add("content");
            firstnameSquare.textContent = line.firstname;

            const directionSquare = document.createElement("div");
            directionSquare.classList.add("content");
            directionSquare.textContent = line.city;

            const countrySquare = document.createElement("div");
            countrySquare.classList.add("content");
            countrySquare.textContent = line.country;

            const phoneSquare = document.createElement("div");
            phoneSquare.classList.add("content");
            phoneSquare.textContent = line.phone;

            const moveBtn = document.createElement("div");
            moveBtn.classList.add("moveBtn");
            moveBtn.textContent = "↕";

            const deleteBtn = document.createElement("div");
            deleteBtn.classList.add("deleteBtn");
            deleteBtn.textContent = "X";

            newLine.appendChild(moveBtn);
            newLine.appendChild(nameSquare);
            newLine.appendChild(firstnameSquare);
            newLine.appendChild(directionSquare);
            newLine.appendChild(countrySquare);
            newLine.appendChild(phoneSquare);
            newLine.appendChild(deleteBtn);

            addEventsToLine(newLine);
            body.appendChild(newLine);
        }

        table.appendChild(body);

        // Add a line
        const addLineBtn = document.createElement("div");
        addLineBtn.classList.add("addLineBtn");
        addLineBtn.textContent = "+ Add a line";
        addLineBtn.addEventListener("click", addLine);
        table.appendChild(addLineBtn);

        flexyDashboard.appendChild(table);

        addOrderBy();
    }

    function order(e){
        const headers = document.querySelectorAll(".headerContent");
        const lines = document.querySelectorAll('.line');
        const header = e.target;
        const vals = [];
        const linesOuterHtml = [];
        let pos;
        //pos is the nth element, if I click on the second header cell, I'll need to take the second value of each line
        headers.forEach((el, index) => {
            if (el == e.target){
                pos = index;
            }
        });

        lines.forEach((line, index) => {
            val = line.querySelectorAll(".content")[pos];
            vals.push([val.textContent, index]); //We keep the indexes so we can replicate the new order later
            linesOuterHtml.push(line);
            
        });

        if(header.classList.contains("down")){
            header.classList.remove("down");
            header.classList.add("up");
            vals.reverse();
        }else{
            if(header.classList.contains("up")){
                header.classList.remove("up");
            }else{
                headers.forEach(el => {
                    el.classList.remove("up");
                    el.classList.remove("down");
                });
            }
            header.classList.add("down");
            vals.sort();
        }

        let newTable = [];
        const body = document.querySelector(".body");
        vals.forEach(el => {
            //Here el[1] will point to the index we stored before ordering
            newTable.push(lines[el[1]]);
        });
        let output = "";
        newTable.forEach(el => {
            output += el.outerHTML;
        });
        body.innerHTML = output;
        document.querySelectorAll(".line").forEach(line => {
            addEventsToLine(line);
        });
        setChangeMode()
    }

    function addOrderBy(e){
        const headers = document.querySelectorAll(".headerContent");
        headers.forEach(cell => {
            cell.addEventListener("click", order);
        });
    }

    const sampleData = [
        //Some data so the example isn't empty, you will replace it whith data from your database or data received from an API
        {
            'name'      :   'Doe',
            'firstname' :   'John',
            'city'      :   'Lyon',
            'country'   :   'France',
            'phone'     :   '0611223344'
        },
        {
            'name'      :   'Martin',
            'firstname' :   'Toto',
            'city'      :   'Paris',
            'country'   :   'France',
            'phone'     :   '0601020304'
        },
        {
            'name'      :   'Doe',
            'firstname' :   'Juan',
            'city'      :   'Barcelona',
            'country'   :   'Espagne',
            'phone'     :   '0612345678'
        },
        {
            'name'      :   'Boon',
            'firstname' :   'Daniel',
            'city'      :   'Lille',
            'country'   :   'France',
            'phone'     :   ' - '
        },
        {
            'name'      :   'Theron',
            'firstname' :   'Lucas',
            'city'      :   'Lyon',
            'country'   :   'France',
            'phone'     :   '0659423711'
        },
        {
            'name'      :   'Williams',
            'firstname' :   'Pharell',
            'city'      :   'Poitiers',
            'country'   :   'France',
            'phone'     :   '0102030405'
        },
        {
            'name'      :   'Paul',
            'firstname' :   'Alice',
            'city'      :   'New York',
            'country'   :   'USA',
            'phone'     :   ' - '
        },
        {
            'name'      :   'LeMarc',
            'firstname' :   'Marc',
            'city'      :   'Valencia',
            'country'   :   'Espagne',
            'phone'     :   '0355555555'
        },
        {
            'name'      :   'Pierre',
            'firstname' :   'Jean',
            'city'      :   ' - ',
            'country'   :   ' - ',
            'phone'     :   '0406040604'
        },
        {
            'name'      :   'Loma',
            'firstname' :   'Basil',
            'city'      :   'Los angeles',
            'country'   :   'USA',
            'phone'     :   ' - '
        },
    ]

    startArray();

});