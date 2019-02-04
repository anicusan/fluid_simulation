/*
 * Stokes Flow simulation code for anicusan.github.io/fluid_sim/index.html
 * Released by Andrei Leonard Nicusan in 2018 with GNU v3.0 License
 * Used data collected in the laboratories of University of Birmingham
 * Used some WebGL code from jamie-wong.com/2016/08/04/webgl-fluid-simulation/
 */

window.FluidSim = function(canvasId, sphereCanvasID, sphereSelectionID, options) {

  /*
   *  Global Data Start
   */

  options = options || {};

  options.initVFn = options.initVFn || [
    'sin(2.0 * 3.1415 * y)',
    'sin(2.0 * 3.1415 * x)'
  ];

  options.initCFn = options.initCFn || [
    'step(1.0, mod(floor((x + 1.5) / 0.2) + floor((y + 1.0) / 0.2), 2.0))',
    'step(1.0, mod(floor((x + 1.5) / 0.2) + floor((y + 1.0) / 0.2), 2.0))',
    'step(1.0, mod(floor((x + 1.5) / 0.2) + floor((y + 1.0) / 0.2), 2.0))'
  ];

  if (options.threshold === undefined) {
    options.threshold = true;
  }

  if (options.advectV === undefined) {
    options.advectV = true;
  }

  if (options.applyPressure === undefined) {
    options.applyPressure = false;
  }

  if (options.showArrows === undefined) {
    options.showArrows = true;
  }

  if (options.dyeSpots === undefined) {
    options.dyeSpots = false;
  }

  // Sphere Data:
  var selectedSphere = 4;
  var spheres = [
    // Sphere 0, stainless steel
    {
      name: 'Steel - 3/8", 5/16", 1/4", 3/16"',
      description: 'Steel 3/8"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 7700, // kg/m^3
      radius: 0.009525, // m
      restitution: -0.75,
      Cd: 0.47,  // Dimensionless
      colour: '#727984',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 1, stainless steel
    {
      description: 'Steel 5/16"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 7700, // kg/m^3
      radius: 0.0079375, // m
      restitution: -0.75,
      Cd: 0.47,  // Dimensionless
      colour: '#727984',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 2, stainless steel
    {
      description: 'Steel 1/4"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 7700, // kg/m^3
      radius: 0.00635, // m
      restitution: -0.75,
      Cd: 0.47,  // Dimensionless
      colour: '#727984',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 3, stainless steel
    {
      description: 'Steel 3/16"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 7700, // kg/m^3
      radius: 0.0047625, // m
      restitution: -0.75,
      Cd: 0.47,  // Dimensionless
      colour: '#727984',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 4, glass
    {
      name: 'Glass - 3/8", 5/16", 1/4", 3/16"',
      description: 'Glass 3/8"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 2800, // kg/m^3
      radius: 0.009525, // m
      restitution: -0.69,
      Cd: 0.47,  // Dimensionless
      colour: '#9db8c4',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 5, glass
    {
      description: 'Glass 5/16"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 2800, // kg/m^3
      radius: 0.0079375, // m
      restitution: -0.69,
      Cd: 0.47,  // Dimensionless
      colour: '#9db8c4',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 6, glass
    {
      description: 'Glass 1/4"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 2800, // kg/m^3
      radius: 0.00635, // m
      restitution: -0.69,
      Cd: 0.47,  // Dimensionless
      colour: '#9db8c4',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 7, glass
    {
      description: 'Glass 3/16"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 2500, // kg/m^3
      radius: 0.0047625, // m
      restitution: -0.69,
      Cd: 0.47,  // Dimensionless
      colour: '#9db8c4',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 8, PTFE
    {
      name: 'PTFE - 3/8", 5/16", 1/4", 3/16"',
      description: 'PTFE 3/8"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 2200, // kg/m^3
      radius: 0.009525, // m
      restitution: -0.602,
      Cd: 0.47,  // Dimensionless
      colour: '#bfc49d',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 9, PTFE
    {
      description: 'PTFE 5/16"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 2200, // kg/m^3
      radius: 0.0079375, // m
      restitution: -0.602,
      Cd: 0.47,  // Dimensionless
      colour: '#bfc49d',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 10, PTFE
    {
      description: 'PTFE 1/4"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 2150, // kg/m^3
      radius: 0.00635, // m
      restitution: -0.602,
      Cd: 0.47,  // Dimensionless
      colour: '#bfc49d',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 11, PTFE
    {
      description: 'PTFE 3/16"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 2200, // kg/m^3
      radius: 0.0047625, // m
      restitution: -0.602,
      Cd: 0.47,  // Dimensionless
      colour: '#bfc49d',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 12, Nylon
    {
      name: 'Nylon - 3/8", 5/16", 1/4", 3/16"',
      description: 'Nylon 3/8"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 1150, // kg/m^3
      radius: 0.009525, // m
      restitution: -0.7,
      Cd: 0.47,  // Dimensionless
      colour: '#bfa6c1',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 13, Nylon
    {
      description: 'Nylon 5/16"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 1150, // kg/m^3
      radius: 0.0079375, // m
      restitution: -0.7,
      Cd: 0.47,  // Dimensionless
      colour: '#bfa6c1',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 14, Nylon
    {
      description: 'Nylon 1/4"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 1150, // kg/m^3
      radius: 0.00635, // m
      restitution: -0.7,
      Cd: 0.47,  // Dimensionless
      colour: '#bfa6c1',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 15, Nylon
    {
      description: 'Nylon 3/16"',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 1150, // kg/m^3
      radius: 0.0047625, // m
      restitution: -0.7,
      Cd: 0.47,  // Dimensionless
      colour: '#bfa6c1',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    /*
    // Sphere 0, rubber
    {
      name: 'rubber',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 1100, // kg/m^3
      radius: 0.009525, // m
      restitution: -0.828,
      Cd: 0.47,  // Dimensionless
      colour: 'red',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // sphere 1, wood
    {
      name: 'wood',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 1000, // kg/m^3
      radius: 0.02, // m
      restitution: -0.403,
      Cd: 0.47,  // Dimensionless
      colour: 'brown',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    // Sphere 3, lead
    {
      name: 'lead',
      // --Initial position--
      position: {x: false, y: false},
      velocity: {x: 0, y: 0},
      acc: {x: 0, y: 0},
      // --Change sphere data--
      density: 11340, // kg/m^3
      radius: 0.025, // m
      restitution: -0.08,
      Cd: 0.47,  // Dimensionless
      colour: 'grey',
      // --Calculated automatically--
      mass: false, //kg
      A: false,
      V: false,
      buoyancy: false,
    },
    */

  ];

  // Environment Data:
  var DENSITY = 975.0; // kg/m^3
  var VISCOSITY = 0.005 // m^2/s - kinematic viscosity
  $("#cst5000").toggleClass("active");

  $("#cst50").click(function(e) {
    e.preventDefault();
    $('.button_viscosity').not(this).removeClass('active');
    $(this).toggleClass("active");

    VISCOSITY = 0.00005;
    reset();
    init_pos();
  });
  $("#cst500").click(function(e) {
    e.preventDefault();
    $('.button_viscosity').not(this).removeClass('active');
    $(this).toggleClass("active");

    VISCOSITY = 0.0005;
    reset();
    init_pos();
  });
  $("#cst5000").click(function(e) {
    e.preventDefault();
    $('.button_viscosity').not(this).removeClass('active');
    $(this).toggleClass("active");

    VISCOSITY = 0.005;
    reset();
    init_pos();
  });
  $("#cst30000").click(function(e) {
    e.preventDefault();
    $('.button_viscosity').not(this).removeClass('active');
    $(this).toggleClass("active");

    VISCOSITY = 0.03;
    reset();
    init_pos();
  });
  // Alcosil 200/50: 0.000005
  // Alcosil 200/500: 0.0005
  // Alcosil 200/5000: 0.005
  // Alcosil 200/30000: 0.03
  var ag = 9.81;  // m/s^2
  // 'Physical' dimension of fluid window
  var dim = options.dim || 2; // m

  var mouse = {x: 0, y: 0, isDown: false};
  var csvString = "";

  // Initial position of selected sphere
  function init_pos() {
    spheres[selectedSphere].position.x = dim / 2;
    spheres[selectedSphere].position.y = spheres[selectedSphere].radius;
    spheres[selectedSphere].acc.x = 0;
    spheres[selectedSphere].acc.y = 0;
    spheres[selectedSphere].velocity.x = 0;
    spheres[selectedSphere].velocity.y = 0;

    terminalVelocityReached = 0;
    endPos = 0;
    $('#data_log').append('-------------------------------------<br>New Simulation - '+
      spheres[selectedSphere].description+': <br>');
    csvString += '\n' + spheres[selectedSphere].description + '\n';
    csvString += 'Fluid density (kg/m^3): , '+DENSITY+'\n';
    csvString += 'Fluid kinematic viscosity (m^2/s): ,'+VISCOSITY+'\n';
    csvString += 'Sphere density (kg/m^3): , '+spheres[selectedSphere].density+'\n';
    csvString += 'Sphere radius (m): , '+spheres[selectedSphere].radius+'\n';
  }
  init_pos();

  // Calculate the area, volume, mass and buoyancy for each ball
  function calc_param() {
    for(i = 0; i < spheres.length; i++)
    {
      spheres[i].A = Math.PI * spheres[i].radius * spheres[i].radius; // m^2
      spheres[i].V = 4 / 3 * Math.PI * spheres[i].radius * spheres[i].radius * spheres[i].radius;
      spheres[i].mass = spheres[i].density * spheres[i].V; // kg/m^3
      spheres[i].buoyancy = DENSITY * spheres[i].V * ag;
    }
  }
  calc_param();

  console.log(spheres);

  // For silly reasons, these have to be equal for now.
  // This is because I assumed grid spacing was equal along
  // each axis, so if you want to change these to not be equal, you'd have to
  // carefully go through the code and decide which values of EPSILON should be
  // 1/WIDTH, and which should be 1/HEIGHT.
  var WIDTH = options.size || 400;
  var HEIGHT = WIDTH;
  var EPSILON = 1/WIDTH;

  // The animation loop runs at 60 fps (hopefully), so we're making the
  // simulation faster or slower by:
  var DELTA_T = 1/60;
  $("#real_time").addClass("active");

  var stopsim = false;

  $("#4x_slower").click(function(e) {
    e.preventDefault();
    $('.button_time').not(this).removeClass('active');
    $(this).addClass("active");

    DELTA_T = 1/240;
    stopsim = false;
  });
  $("#2x_slower").click(function(e) {
    e.preventDefault();
    $('.button_time').not(this).removeClass('active');
    $(this).addClass("active");

    DELTA_T = 1/120;
    stopsim = false;
  });
  $("#stop_sim").click(function(e) {
    e.preventDefault();
    $('.button_time').not(this).removeClass('active');
    $(this).addClass("active");

    stopsim = true;
  });
  $("#real_time").click(function(e) {
    e.preventDefault();
    $('.button_time').not(this).removeClass('active');
    $(this).addClass("active");

    DELTA_T = 1/60;
    stopsim = false;
  });
  $("#2x_faster").click(function(e) {
    e.preventDefault();
    $('.button_time').not(this).removeClass('active');
    $(this).addClass("active");

    DELTA_T = 1/30;
    stopsim = false;
  });
  $("#4x_faster").click(function(e) {
    e.preventDefault();
    $('.button_time').not(this).removeClass('active');
    $(this).addClass("active");

    DELTA_T = 1/15;
    stopsim = false;
  });

  $("#2x_faster").click();

  var canvas = document.getElementById(canvasId);
  var sphereCanvas = document.getElementById(sphereCanvasID);
  var sphereSelection = document.getElementById(sphereSelectionID);

  // Initialize the sphere canvas environment
  sphereCanvas.width = WIDTH;
  sphereCanvas.height = HEIGHT;
  var spherectx = sphereCanvas.getContext("2d");

  // Initialize sphere selection canvas
  sphereSelection.width = WIDTH;
  sphereSelection.height = HEIGHT * 0.1;
  var selectctx = sphereSelection.getContext("2d");

  /*
   *  Global Data End
   */


  /*
   *  Sphere Environment Functionality Start
   */

  function sphere_getMousePosition(e) {
    mouse.x = e.pageX - $(sphereCanvas).offset().left;
    mouse.y = e.pageY - $(sphereCanvas).offset().top;
  }

  function sphere_mouseDown(e) {
    if (e.which == 1) {
      sphere_getMousePosition(e);
      mouse.isDown = true;
      spheres[selectedSphere].position.x = mouse.x / WIDTH * dim;
      spheres[selectedSphere].position.y = mouse.y / HEIGHT * dim;
    }
  }

  function sphere_mouseUp(e) {
    if (e.which == 1) {
        mouse.isDown = false;
        console.log('x: '+(spheres[selectedSphere].position.y - mouse.y / HEIGHT * dim));
        console.log('y: '+(spheres[selectedSphere].position.x - mouse.x / WIDTH * dim));
        spheres[selectedSphere].velocity.y = (spheres[selectedSphere].position.y - mouse.y / HEIGHT * dim) * 100;
        spheres[selectedSphere].velocity.x = (spheres[selectedSphere].position.x - mouse.x / WIDTH * dim) * 100;
    }
  }

  sphereCanvas.onmousemove = sphere_getMousePosition;
  sphereCanvas.onmousedown = sphere_mouseDown;
  sphereCanvas.onmouseup = sphere_mouseUp;

  // Initialize spheres menu
  function init_sphereSelection() {
    var sphlen = WIDTH / spheres.length;
    var sphctr = sphereSelection.height / 2;
    var sphname;

    for (i = 0; i < spheres.length; i++)
    {
      selectctx.beginPath();
      selectctx.fillStyle = spheres[i].colour;
      selectctx.arc(i * sphlen + sphlen / 2, sphctr, spheres[i].radius / dim * WIDTH, 0, Math.PI*2, true);
      selectctx.fill();
      sphname = spheres[i].name || "";
      selectctx.font = "12px Arial";
      selectctx.fillText(sphname, i * sphlen + sphlen / 2,sphctr*1.7);
      selectctx.closePath();
    }
  }

  init_sphereSelection();

  // Select sphere on click
  function select_mouseDown(e) {
    // Select Ball
    if (e.which == 1) {
      console.log('selected');
      mouse.x = e.pageX - $(sphereCanvas).offset().left;
      selectedSphere = Math.floor(mouse.x / (WIDTH / spheres.length));
      init_pos();
      reset();
    }
  }

  sphereSelection.onmousedown = select_mouseDown;

  var Fx = false; // Force acting in x direction
  var Fy = false; // Force acting in y direction
  var eqVel = false // Actual Velocity, including x and y
  var Re = false; // Reynolds number
  var termVelSq = false;

  // Sphere movement in a frame
  // To simulate movement faster than reality (ex: DELTA_T = 1/15)
  // the sphere needs to move in smaller discreet steps.
  // Use iters as number of iterations in a timestep
  function sphere_physics() {
    var sph = spheres[selectedSphere];
    var iters = 256;
    var timeframe = DELTA_T/iters;

    if ( ! mouse.isDown) {
      for (i = 0; i < iters; i++) {
        // Calculate Cd in terms of Re
        // Reynolds number: Re = velocity * diameter / kinematic_viscosity
        eqVel = Math.sqrt(sph.velocity.x * sph.velocity.x + sph.velocity.y * sph.velocity.y);
        Re = Math.abs(eqVel) * 2 * sph.radius / VISCOSITY;

        //console.log('Re: '+Re);

        if (Re < 0.2 )
          sph.Cd = 24 / Re;
        else if (Re < 1000)
          sph.Cd = 24 / Re * (1 + 0.15 * Math.pow(Re, 0.687));
        else if (Re < 200000)
          sph.Cd = 0.44;
        else
          sph.Cd = 0.11;

        //console.log("Cd: "+sph.Cd);
        // Drag Force: Fd = -1/2 * Cd * A * rho * v * v
        // Define 'down' as ypositive and 'right' as xpositive
        // Drag is always opposite to the sense of movement
        // so use sign of velocity
        // and buoyancy will act 'upwards', therefore negative y
        Fx = -0.5 * sph.Cd * sph.A * DENSITY * sph.velocity.x * sph.velocity.x * Math.sign(sph.velocity.x);
        Fy = -0.5 * sph.Cd * sph.A * DENSITY * sph.velocity.y * sph.velocity.y * Math.sign(sph.velocity.y) - sph.buoyancy;
        //console.log("Fy: "+Fy);

        Fx = (isNaN(Fx) ? 0 : Fx);
        Fy = (isNaN(Fy) ? 0 : Fy);


        // Calculate acceleration (F = ma)
        sph.acc.x = Fx / sph.mass;
        sph.acc.y = ag + (Fy / sph.mass);
        //console.log("Acc y: "+sph.acc.y);

        // Integrate to get velocity
        sph.velocity.x += sph.acc.x * timeframe;
        sph.velocity.y += sph.acc.y * timeframe;
        //console.log("Vel y: "+sph.velocity.y);

        // Integrate to get position
        sph.position.x += sph.velocity.x * timeframe;
        sph.position.y += sph.velocity.y * timeframe;
        //console.log("Pos y: "+sph.position.y);
      }

      // Handle collisions
      if (sph.position.y > dim - sph.radius) {
          sph.velocity.y *= sph.restitution;
          sph.position.y = dim - sph.radius;
      }
      if (sph.position.y < sph.radius) {
          sph.velocity.y *= sph.restitution;
          sph.position.y = sph.radius;
      }
      if (sph.position.x > dim - sph.radius) {
          sph.velocity.x *= sph.restitution;
          sph.position.x = dim - sph.radius;
      }
      if (sph.position.x < sph.radius) {
          sph.velocity.x *= sph.restitution;
          sph.position.x = sph.radius;
      }
    }
  }

  function drawSphere() {
    var sph = spheres[selectedSphere];

    spherectx.clearRect(0, 0, WIDTH, HEIGHT);
    spherectx.save();
    spherectx.translate(sph.position.x / dim * WIDTH, sph.position.y / dim * HEIGHT);
    spherectx.beginPath();
    spherectx.fillStyle = sph.colour;
    spherectx.arc(0, 0, sph.radius / dim * WIDTH, 0, Math.PI * 2, true);
    spherectx.fill();
    spherectx.closePath();
    spherectx.restore();

  }

  function drawSlingshot() {
    var sph = spheres[selectedSphere];

    spherectx.beginPath();
    spherectx.moveTo(sph.position.x / dim * WIDTH, sph.position.y / dim * HEIGHT);
    spherectx.lineTo(mouse.x, mouse.y);
    spherectx.stroke();
    spherectx.closePath();
  }

  var terminalVelocityReached = 0;
  var initial_position_y = 0;
  var startPos = 0;
  var endPos = 0;
  var lenMeasure = 0.15; // m
  var startIters = -1;

  function disp() {
    var sph = spheres[selectedSphere];
    var toDisp = false;

    $("#acc").empty(); $("#acc_x").empty(); $("#acc_y").empty();
    $("#vel").empty(); $("#vel_x").empty(); $("#vel_y").empty();
    $("#pos").empty(); $("#pos_x").empty(); $("#pos_y").empty();

    if (sph.position.y < dim - sph.radius * 1.7) {
      toDisp = Math.sqrt(sph.acc.x * sph.acc.x + sph.acc.y * sph.acc.y);
      $('#acc').append(toDisp.toFixed(4));
      toDisp = Math.sqrt(sph.velocity.x * sph.velocity.x + sph.velocity.y * sph.velocity.y);
      $('#vel').append(toDisp.toFixed(4));

      $('#acc_x').append(sph.acc.x.toFixed(4));
      $('#acc_y').append(sph.acc.y.toFixed(4));
      $('#vel_x').append(sph.velocity.x.toFixed(4));
      $('#vel_y').append(sph.velocity.y.toFixed(4));
      $('#pos_x').append(sph.position.x.toFixed(4));
      $('#pos_y').append(sph.position.y.toFixed(4));
    }
    else {
      $('#acc').append(0);
      $('#vel').append(0);

      $('#acc_x').append(sph.acc.x.toFixed(4));
      $('#acc_y').append(0);
      $('#vel_x').append(sph.velocity.x.toFixed(4));
      $('#vel_y').append(0);
      $('#pos_x').append(sph.position.x.toFixed(4));
      $('#pos_y').append((dim - sph.radius).toFixed(4));
    }

    if (startIters > -1)
      startIters++;
    if (Math.sqrt(sph.acc.x * sph.acc.x + sph.acc.y * sph.acc.y) < 0.0001) {
      if (terminalVelocityReached == 0) {
        toDisp = sph.position.y - initial_position_y;
        $('#data_log').append('Terminal velocity reached after '+(toDisp*100).toFixed(4)+'cm.<br>');
        csvString += 'Terminal velocity reached after (m):,'+(toDisp).toFixed(4)+'\n';

        startIters = 0;
        startPos = sph.position.y;

        terminalVelocityReached = 1;
      }
    }

    if (terminalVelocityReached == 1 && (sph.position.y - startPos).toFixed(4) >= lenMeasure && endPos == 0) {
      endPos = sph.position.y;
      toDisp = startIters*DELTA_T;
      startIters = -1;
      $('#data_log').append(''+(lenMeasure*100)+'cm travelled in '+toDisp.toFixed(2)+'s.<br>');
      csvString += ''+(lenMeasure*100)+'cm travelled in (s):, '+toDisp.toFixed(2)+'\n';
    }

    if (sph.position.y > dim - sph.radius * 1.2 && endPos == 0) {
      $('#data_log').append('Did not travel '+(lenMeasure)*100+'cm at terminal velocity.<br>');
      endPos = 1;
      csvString += 'Did not travel '+(lenMeasure)+'m at terminal velocity\n';
    }

  }

  var logElement = document.getElementById("data_log");

  setInterval(function() {
      // allow 1px inaccuracy by adding 1
      var isScrolledToBottom = (logElement.scrollHeight - logElement.clientHeight <= logElement.scrollTop + 80);

      // scroll to bottom if isScrolledToBottom is true
      if (isScrolledToBottom) {
        logElement.scrollTop = logElement.scrollHeight - logElement.clientHeight
      }
  }, 500)

  function download_csv() {
    /*Encode and attach the data to a hyperlink for download*/
    console.log(csvString);

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'data_fluid_sim.csv';
    hiddenElement.click();
  }
  $('#exportCSV').click(download_csv);

  function clearLog() {
    csvString = "";
    $(logElement).empty();
  }
  $('#clearLog').click(clearLog);

  function sphereSplash() {
    var sph = spheres[selectedSphere];

    if (mouse.isDown)
      return ;

    textures.velocity1.drawTo(function() {
      addSplat(
        textures.velocity0,
        [(sph.velocity.x / dim) * sph.mass * 60 * DELTA_T, -(sph.velocity.y / dim) * sph.mass * 60 * DELTA_T, 0.0, 0.0],
        [(sph.position.x / dim), 1.0 - (sph.position.y / dim)],
        sph.radius / dim,
      );
    });
    textures.swap('velocity0', 'velocity1');
  };

  /*
   *  Sphere Environment Functionality End
   */

  /*
   *  Fluid Environment Functionality Start
   */

  var gl = GL.create();
  gl.canvas.id = canvasId;
  gl.canvas.width = WIDTH;
  gl.canvas.height = HEIGHT;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  $(canvas).replaceWith(gl.canvas).attr("id", canvasId);

  // Standard 2-triangle mesh covering the viewport
  // when draw with gl.TRIANGLE_STRIP
  var standardMesh = GL.Mesh.load({
    vertices: [
      [-1, 1],
      [1, 1],
      [-1, -1],
      [1, -1]
    ],
    coords: [
      [0, 1],
      [1, 1],
      [0, 0],
      [1, 0]
    ]
  });

  var standardVertexShaderSrc = '\
    varying vec2 textureCoord;\
    void main() {\
      textureCoord = gl_TexCoord.xy;\
      gl_Position = gl_Vertex;\
    }';

  // Given a texture holding a 2D velocity field, draw arrows
  // showing the direction of the fluid flow.
  var drawVectorFieldArrows = (function() {
    var shader = new GL.Shader('\
      mat2 rot(float angle) { \
        float c = cos(angle); \
        float s = sin(angle); \
        \
        return mat2( \
          vec2(c, -s), \
          vec2(s, c) \
        ); \
      } \
      \
      attribute vec2 position; \
      uniform sampler2D velocity; \
      void main() { \
        vec2 v = texture2D(velocity, (position + 1.0) / 2.0).xy; \
        float scale = 0.05 * length(v); \
        float angle = atan(v.y, v.x); \
        mat2 rotation = rot(-angle); \
        gl_Position = vec4( \
          (rotation * (scale * gl_Vertex.xy)) + position, \
          0.0, 1.0); \
      } \
    ', '\
      void main() { \
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); \
      } \
    ');

    // Triangle pointing towards positive x axis
    // with baseline on the y axis
    var triangleVertices = [
      [0, 0.4],
      [2, 0],
      [0, -0.4]
    ];

    var arrowsMesh = new GL.Mesh({triangles: false});
    arrowsMesh.addVertexBuffer('positions', 'position');

    var INTERVAL = 30;

    for (var i = INTERVAL / 2; i < HEIGHT; i += INTERVAL) {
      for (var j = INTERVAL / 2; j < WIDTH; j += INTERVAL) {
        for (var k = 0; k < 3; k++) {
          arrowsMesh.vertices.push(triangleVertices[k]);
          arrowsMesh.positions.push([2 * j / WIDTH - 1, 2 * i / HEIGHT - 1]);
        }
      }
    }
    console.log(arrowsMesh);
    arrowsMesh.compile();

    return function(velocityTexture) {
      velocityTexture.bind(0);
      shader.uniforms({
        velocity: 0
      });

      shader.draw(arrowsMesh, gl.TRIANGLES);
    };
  })();

  // Given glsl expressions for r, g, b, a mapping (x, y) -> a value, return
  // a function that will paint a color generated by that function evaluated at
  // every pixel of the output buffer. (x, y) will be in the range
  // ([-1, 1], [-1, 1]).
  var makeFunctionPainter = function(r, g, b, a) {
    r = r || '0.0';
    g = g || '0.0';
    b = b || '0.0';
    a = a || '0.0';

    var shader = new GL.Shader(standardVertexShaderSrc, '\
      varying vec2 textureCoord; \
      void main() { \
        float x = 2.0 * textureCoord.x - 1.0; \
        float y = 2.0 * textureCoord.y - 1.0; \
        gl_FragColor = vec4(' + [r, g, b, a].join(',') +'); \
      } \
    ');

    return function() {
      shader.draw(standardMesh, gl.TRIANGLE_STRIP);
    };
  };

  var drawBlack = makeFunctionPainter('0.0', '0.0', '0.0', '1.0');

  // Draw a texture directly to the framebuffer.
  // Will stretch to fit, but in practice the texture and the framebuffer should be
  // the same size.
  var drawTexture = (function() {
    var shader = new GL.Shader(standardVertexShaderSrc, '\
      varying vec2 textureCoord; \
      uniform sampler2D inputTexture; \
      void main() { \
        gl_FragColor = texture2D(inputTexture, textureCoord); \
      } \
    ');

    return function(inputTexture) {
      inputTexture.bind(0);
      shader.uniforms({
        input: 0
      });
      shader.draw(standardMesh, gl.TRIANGLE_STRIP)
    };
  })();

  // Draw a texture to the framebuffer, thresholding at 0.5
  var drawTextureThreshold = (function() {
    var shader = new GL.Shader(standardVertexShaderSrc, '\
      varying vec2 textureCoord; \
      uniform sampler2D inputTexture; \
      void main() { \
        gl_FragColor = step(0.5, texture2D(inputTexture, textureCoord)); \
      } \
    ');

    return function(inputTexture) {
      inputTexture.bind(0);
      shader.uniforms({
        input: 0
      });
      shader.draw(standardMesh, gl.TRIANGLE_STRIP)
    };
  })();

  // Given an velocity texture and a time delta, advect the
  // quantities in the input texture into the output texture
  var advect = (function() {
    var shader = new GL.Shader(standardVertexShaderSrc, '\
      uniform float deltaT; \
      uniform sampler2D inputTexture; \
      uniform sampler2D velocity; \
      varying vec2 textureCoord; \
      \
      void main() { \
        vec2 u = texture2D(velocity, textureCoord).xy; \
        \
        vec2 pastCoord = fract(textureCoord - (0.5 * deltaT * u)); \
        gl_FragColor = texture2D(inputTexture, pastCoord); \
      } \
    ');

    return function(inputTexture, velocityTexture) {
      inputTexture.bind(0);
      velocityTexture.bind(1);

      shader.uniforms({
        deltaT: DELTA_T,
        input: 0,
        velocity: 1
      });
      shader.draw(standardMesh, gl.TRIANGLE_STRIP);
    };
  })();

  // Apply a "splat" of change to a given place with a given
  // blob radius. The effect of the splat has an exponential falloff.
  var addSplat = (function() {
    var shader = new GL.Shader(standardVertexShaderSrc, '\
      uniform vec4 change; \
      uniform vec2 center; \
      uniform float radius; \
      uniform sampler2D inputTex; \
      \
      varying vec2 textureCoord; \
      \
      void main() { \
        float dx = center.x - textureCoord.x; \
        float dy = center.y - textureCoord.y; \
        vec4 cur = texture2D(inputTex, textureCoord); \
        gl_FragColor = cur + change * exp(-(dx * dx + dy * dy) / radius); \
      } \
    ');

    return function(inputTexture, change, center, radius) {
      inputTexture.bind(0);
      shader.uniforms({
        change: change,
        center: center,
        radius: radius,
        inputTex: 0
      });
      shader.draw(standardMesh, gl.TRIANGLE_STRIP);
    };
  })();

  // Make sure all the color components are between 0 and 1
  var clampColors = (function() {
    var shader = new GL.Shader(standardVertexShaderSrc, '\
      uniform sampler2D inputTex; \
      varying vec2 textureCoord; \
      \
      void main() { \
        gl_FragColor = clamp(texture2D(inputTex, textureCoord), 0.0, 1.0); \
      } \
    ');

    return function(inputTexture) {
      inputTexture.bind(0);
      shader.uniforms({
        inputTex: 0
      });
      shader.draw(standardMesh, gl.TRIANGLE_STRIP);
    };
  })();

  // Calculate the divergence of the advected velocity field, and multiply by
  // (2 * epsilon * rho / deltaT).
  var calcDivergence = (function() {
    var shader = new GL.Shader(standardVertexShaderSrc, '\
      uniform float deltaT;         // Time between steps \n\
      uniform float rho;            // Density \n\
      uniform float epsilon;        // Distance between grid units \n\
      uniform sampler2D velocity;   // Advected velocity field, u_a \n\
      \
      varying vec2 textureCoord; \
      \
      vec2 u(vec2 coord) { \
        return texture2D(velocity, fract(coord)).xy; \
      } \
      \
      void main() { \
        gl_FragColor = vec4((-2.0 * epsilon * rho / deltaT) * ( \
          (u(textureCoord + vec2(epsilon, 0)).x - \
           u(textureCoord - vec2(epsilon, 0)).x) \
          + \
          (u(textureCoord + vec2(0, epsilon)).y - \
           u(textureCoord - vec2(0, epsilon)).y) \
        ), 0.0, 0.0, 1.0); \
      } \
    ');

    return function(velocityTexture) {
      velocityTexture.bind(0);
      shader.uniforms({
        velocity: 0,
        epsilon: EPSILON,
        deltaT: DELTA_T,
        rho: DENSITY
      });
      shader.draw(standardMesh, gl.TRIANGLE_STRIP);
    };
  })();

  // Perform a single iteration of the Jacobi method in order to solve for
  // pressure.
  var jacobiIterationForPressure = (function() {
    var shader = new GL.Shader(standardVertexShaderSrc, '\
      uniform float epsilon;        // Distance between grid units \n\
      uniform sampler2D divergence; // Divergence field of advected velocity, d \n\
      uniform sampler2D pressure;   // Pressure field from previous iteration, p^(k-1) \n\
      \
      varying vec2 textureCoord; \
      \
      float d(vec2 coord) { \
        return texture2D(divergence, fract(coord)).x; \
      } \
      \
      float p(vec2 coord) { \
        return texture2D(pressure, fract(coord)).x; \
      } \
      \
      void main() { \
        gl_FragColor = vec4(0.25 * ( \
          d(textureCoord) \
          + p(textureCoord + vec2(2.0 * epsilon, 0.0)) \
          + p(textureCoord - vec2(2.0 * epsilon, 0.0)) \
          + p(textureCoord + vec2(0.0, 2.0 * epsilon)) \
          + p(textureCoord - vec2(0.0, 2.0 * epsilon)) \
        ), 0.0, 0.0, 1.0); \
      } \
    ');

    return function(divergenceTexture, pressureTexture) {
      divergenceTexture.bind(0);
      pressureTexture.bind(1);
      shader.uniforms({
        divergence: 0,
        pressure: 1,
        epsilon: EPSILON
      });
      shader.draw(standardMesh, gl.TRIANGLE_STRIP);
    };
  })();

  // Subtract the pressure gradient times a constant from the advected velocity
  // field.
  var subtractPressureGradient = (function() {
    var shader = new GL.Shader(standardVertexShaderSrc, '\
      uniform float deltaT;         // Time between steps \n\
      uniform float rho;            // Density \n\
      uniform float epsilon;        // Distance between grid units \n\
      uniform sampler2D velocity;   // Advected velocity field, u_a \n\
      uniform sampler2D pressure;   // Solved pressure field \n\
      \
      varying vec2 textureCoord; \
      \
      float p(vec2 coord) { \
        return texture2D(pressure, fract(coord)).x; \
      } \
      \
      void main() { \
        vec2 u_a = texture2D(velocity, textureCoord).xy; \
        \
        float diff_p_x = (p(textureCoord + vec2(epsilon, 0.0)) - \
                          p(textureCoord - vec2(epsilon, 0.0))); \
        float u_x = u_a.x - deltaT/(2.0 * rho * epsilon) * diff_p_x; \
        \
        float diff_p_y = (p(textureCoord + vec2(0.0, epsilon)) - \
                          p(textureCoord - vec2(0.0, epsilon))); \
        float u_y = u_a.y - deltaT/(2.0 * rho * epsilon) * diff_p_y; \
        \
        gl_FragColor = vec4(u_x, u_y, 0.0, 0.0); \
      } \
    ');

    return function(velocityTexture, pressureTexture) {
      velocityTexture.bind(0);
      pressureTexture.bind(1);
      shader.uniforms({
        velocity: 0,
        pressure: 1,
        epsilon: EPSILON,
        deltaT: DELTA_T,
        rho: DENSITY
      });
      shader.draw(standardMesh, gl.TRIANGLE_STRIP);
    };
  })();

  var makeTextures = function(names) {
    var ret = {};
    names.forEach(function(name) {
      ret[name] = new GL.Texture(WIDTH, HEIGHT, {type: gl.FLOAT});
    });

    ret.swap = function(a, b) {
      var temp = ret[a];
      ret[a] = ret[b];
      ret[b] = temp;
    };

    return ret;
  };

  var textures = makeTextures([
    'velocity0',
    'velocity1',
    'color0',
    'color1',
    'divergence',
    'pressure0',
    'pressure1'
  ]);

  var initVFnPainter = makeFunctionPainter(options.initVFn[0],
                                           options.initVFn[1]);
  var initCFnPainter = makeFunctionPainter(options.initCFn[0],
                                           options.initCFn[1],
                                           options.initCFn[2]);

  var reset = function() {
    textures.velocity0.drawTo(initVFnPainter);
    textures.color0.drawTo(initCFnPainter);
    textures.pressure0.drawTo(drawBlack);
  };

  reset();
  $('#reset').click(function() {
    init_pos();
    reset();
  });

  // Reset the simulation on double click
  sphereCanvas.addEventListener('dblclick', reset);

  // Returns true if the canvas is on the screen
  // If "middleIn" is true, then will only return true if the middle of the
  // canvas is within the scroll window.
  var onScreen = function(middleIn) {
    var container = canvas.offsetParent;

    var canvasBottom = canvas.offsetTop + canvas.height;
    var canvasTop = canvas.offsetTop;

    var containerTop = window.scrollY;
    var containerBottom = window.scrollY + window.innerHeight;

    if (middleIn) {
      return (containerTop < (canvasTop + canvasBottom) / 2 &&
              (canvasTop + canvasBottom) / 2 < containerBottom);
    } else {
      return (containerTop < canvasBottom && containerBottom > canvasTop);
    }
  };

  // Calculate the pressure, leaving the result in textures.pressure0
  var JACOBI_ITERATIONS = 10;
  $('#jacobi_disp').text(JACOBI_ITERATIONS);

  $("#jacobi_minus").click(function(e) {
    e.preventDefault();

    if (JACOBI_ITERATIONS > 0)
      JACOBI_ITERATIONS -= 2;

    $('#jacobi_disp').text(JACOBI_ITERATIONS);
  });

  $("#jacobi_plus").click(function(e) {
    e.preventDefault();

    if (JACOBI_ITERATIONS < 31)
      JACOBI_ITERATIONS += 2;
    $('#jacobi_disp').text(JACOBI_ITERATIONS);
  });


  /*
   *  Fluid Environment Functionality End
   */

  /*
   *  Frames Start
   */

  gl.ondraw = function() {
    //console.log('draw');
    // If the canvas isn't visible, don't draw it
    // if (!onScreen()) return;

    if (stopsim) return;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (options.threshold) {
      drawTextureThreshold(textures.color0);
    } else {
      drawTexture(textures.color0);
    }

    if (options.showArrows) {
      drawVectorFieldArrows(textures.velocity0);
    }
    gl.begin(gl.POINTS); gl.vertex(1, 2, 3); gl.end();

    drawSphere();
    sphereSplash();
    if (mouse.isDown)
      drawSlingshot();
    disp();
  };

  gl.onupdate = function() {
    //console.log('update');
    // If the canvas isn't fully on-screen, don't run the simulation
    // if (!onScreen(true)) return;

    if (stopsim) return;

    if (options.advectV) {
      // Advect the velocity texture through itself, leaving the result in
      // textures.velocity0
      textures.velocity1.drawTo(function() {
        advect(textures.velocity0, textures.velocity0);
      });
      textures.swap('velocity0', 'velocity1');
    }

    if (options.applyPressure) {
      // Calculate the divergence, leaving the result in textures.divergence
      textures.divergence.drawTo(function() {
        calcDivergence(textures.velocity0);
      });

      for (var i = 0; i < JACOBI_ITERATIONS; i++) {
        textures.pressure1.drawTo(function() {
          jacobiIterationForPressure(textures.divergence, textures.pressure0);
        });
        textures.swap('pressure0', 'pressure1');
      }

      // Subtract the pressure gradient from the advected velocity texture,
      // leaving the result in textures.velocity0
      textures.velocity1.drawTo(function() {
        subtractPressureGradient(textures.velocity0, textures.pressure0);
      });
      textures.swap('velocity0', 'velocity1');
    }

    // Advect the color field, leaving the result in textures.color0
    textures.color1.drawTo(function() {
      advect(textures.color0, textures.velocity0);
    });
    textures.swap('color0', 'color1');

    if (options.dyeSpots) {
      // Add a few spots slowly emitting dye to prevent the color from
      // eventually converging to the grey-ish average color of the whole fluid
      var addDyeSource = function(color, location) {
        textures.color1.drawTo(function() {
          addSplat(
            textures.color0,
            color.concat([0.0]),
            location,
            0.01
          );
        });
        textures.swap('color0', 'color1');
      };

      // Add red to bottom left
      addDyeSource([0.004, -0.002, -0.002], [0.2, 0.2]);

      // Add blue to the top middle
      addDyeSource([-0.002, -0.002, 0.004], [0.5, 0.9]);

      // Add green to the bottom right
      addDyeSource([-0.002, 0.004, -0.002], [0.8, 0.2]);
    }

    sphere_physics();
  };

  gl.onmousemove = function(ev) {
    if (ev.dragging) {
      textures.velocity1.drawTo(function() {
        addSplat(
          textures.velocity0,
          [5.0 * ev.deltaX / WIDTH, -5.0 * ev.deltaY / HEIGHT, 0.0, 0.0],
          [ev.offsetX / WIDTH, 1.0 - ev.offsetY / HEIGHT],
          0.000177,
        );
      });
      textures.swap('velocity0', 'velocity1');
    }
  };

  /*
   *  Frames End
   */

  gl.animate();
};
