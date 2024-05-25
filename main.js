const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);
localStorage.setItem('bestBrain', '{"levels":[{"inputs":[0,0,0,0.36600145899380065,0.6568824621090661],"outputs":[0,1,1,1,1,0],"biases":[-0.1053132308532665,-0.1836884142492181,-0.44678721572157065,-0.19844719573571243,-0.015623535634275387,0.27280815549098286],"weights":[[-0.20648062080310384,-0.5478682038235014,0.475617804127173,-0.733951813177862,0.06655359410461927,-0.4784290730608719],[-0.28051968696614044,-0.6462845149828507,0.8247167479992134,0.23866240889336224,0.3913292060520207,0.56064245705991],[-0.5737166454550816,-0.9625498866502694,-0.4155950928465351,-0.3702513516221099,-0.21363436116595697,0.2756804928170643],[-0.10864151771813241,0.012763663516477536,-0.0840376384065679,0.4225031829816017,0.6820894201050159,0.7716701941022409],[-0.4337355057322554,0.6281348364660279,-0.4507067153571077,0.1442516829262243,0.033264288611550015,-0.06232566579310852]]},{"inputs":[0,1,1,1,1,0],"outputs":[1,1,1,0],"biases":[-0.3725075032784798,-0.5404782809047308,-0.5242946206816737,-0.13885817079659044],"weights":[[0.20847762981966506,0.6245533114577916,-0.6538474254325722,0.036582699098973076],[0.05154093573036769,0.2262735489500289,0.2568407941128099,0.5173874102228219],[0.6156743348306423,-0.39628410586054413,-0.11275495805657951,-0.4141709279007226],[-0.25088645541461485,-0.021665098247207647,-0.31640857933202404,-0.2808684278522815],[-0.37710039781497723,-0.26678244838806375,-0.3012612704293809,-0.6062610172120114],[0.6239124419672328,-0.0435148589560421,-0.5457935303354589,0.532065612923721]]}]}')
N=1;
const cars=generateCars(N);
let bestCar= cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0; i<cars.length; i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, 0.01)
        }
    }
}

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(0),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(1),-1000,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-1000,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-1200,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(0),-1200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-1500,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(1),-1500,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(2),-1800,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(0),-2100,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(1),-2100,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(2),-2500,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(2),-2800,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(1),-2800,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(0),-3300,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(1),-3000,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(2),-3300,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(0),-3700,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(1),-3700,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(2),-4000,30,50,"DUMMY",2.2),
    new Car(road.getLaneCenter(1),-4000,30,50,"DUMMY",2.2),
    new Car(road.getLaneCenter(0),-4400,30,50,"DUMMY",2.2),

];

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
}

//function discard(){
//    localStorage.removeItem("bestBrain");
//}

function generateCars(N){
    const cars=[];
    for(let i=1; i<=N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}
function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }

    carCtx.globalAlpha=0.2;

    for(let i=0; i<cars.length; i++){
        cars[i].draw(carCtx,"blue");
    }

    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue", true);
    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}
