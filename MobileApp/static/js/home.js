
function opensign() {
      document.getElementById("sign_box").style.display = "flex";
    }
function closesign() {
      document.getElementById("sign_box").style.display = "none";
    }


function addReq(Hash_num) {
      let newReq = document.createElement("div");
      newReq.className = "reqs";

      let Hash = document.createElement("div");
      Hash.className = "hash";

      Hash.innerHTML = Hash_num;


      let Choice = document.createElement("div");
      Choice.className = "choice";
      
      let Agree = document.createElement("div");
      Agree.innerHTML = "o";

      let Reject = document.createElement("div");
      Reject.innerHTML = "x";

      Agree.addEventListener("click", function(){
        newReq.remove();
        alert("Document Signed Successfully")
      })

      Reject.addEventListener("click", function(){
        newReq.remove();
        alert("Document Rejected")
      })


      Choice.appendChild(Agree);
      Choice.appendChild(Reject);

      newReq.appendChild(Hash);
      newReq.appendChild(Choice);

      document.getElementById("slist").appendChild(newReq);

      document.getElementById("container").appendChild(newReq);
    }


    