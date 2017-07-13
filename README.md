# BlockStarter 4.0 Final Project

Group E
- Ahmad Jawid Jamiulahmadi (380457) @jawid
- Aqa Mustafa Akhlaqi (380455) @akhlaqi
- Filippo Boiani (387680) @filippo.boiani
- Gabriel Vilen (387555) @gavil
- Hekmatullah Sajid (380454) @hekmatullah.sajid
- Riccardo Sibani (382708) @riccardo.sibani
- Rohullah Ayobi (380448) @rohullahayobi
- Stefan Stojkovski (387529) @stefan.stojkovski

## How to run it
- Go to project folder. 
- Run the following command: 

    `docker-compose up --build`
- Open your browser at the following link:

    `your-docker-machine-ip:4000`


## Api 

Method | Route | Params | Description
--- | --- | ---
*GET* | `/api/v1/` | | Get Hello World
*POST* | `/api/v1/projects` |  | Create a project
*POST* | `/api/v1/projects/fund` | \"project": "project address",\"backer": "backer address",\"amount": 6  | Fund a project
*GET* | `/api/v1/projects` | | Get all projects
*GET* | `/api/v1/projects/creator/:creator` | | Get all projects created by a creator
*GET* | `/api/v1/projects/backer/:backer ` | | Get all projects funded by a backer
*GET* | `/api/v1/projects/status/:project ` | | Show project status
*GET* | `/api/v1/projects/:project ` | | Show project information
*POST* | `/api/v1/projects/withdraw ` | | Withdraw funds from the project

## Project extension
- A: kill a project when the time is up and the goal is not met. 


## Metodology 
- Scrum (1 week iteration)

## Tools 
Technologies: 
- Slack for communication
- GitLab for VCS
- Slack WebHook for commit notifications 

Dev Tools:
- Server: Node.js 
- Client: Angular.js


## Tasks (25; 25 done, 0 in progress, 0 todo)
- Project contract: withdraw funds (only owner) 
- Project contract: claim project shares (only backers) 
- MongoDB Connection [ X ]
- MongoDB Schema Definition [ X ]
- Create a Project API [ X ]
- Show Project Info API [ X ]
- List Projects API [ X ]
- List Created Project API [ X ]
- List Backed Project API [ X ]
- Login API (passport) [ X ]
- Back a Project API [ X ]
- Withdraw funds API [ X ]
- Get Project API [ X ]
- Show Status API [ X ]
- Claim Shares API [ X ]
- Show Share API [ X ]
- Kill project API [ X ]
- Project deadline [ X ]
- Automatic kill when the goal is not met [ X ]
- Login View [ X ]
- List projects View [ X ]
- Create a Project View [ X ]
- Project Info View [ X ]
- Back a Project View [ X ]
- Kill Project View [ X ]




