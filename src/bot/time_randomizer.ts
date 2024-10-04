//sleep implementation
function sleep(ms: number) : Promise<void>
{
	return (new Promise(resolve => setTimeout(resolve, ms)));
}

//to check the current time in hours and mins
function realTime() : number[]
{
	const currentTimearr : number[] = [];
	const currentTime : Date = new Date();
	currentTimearr.push(currentTime.getHours())
	currentTimearr.push(currentTime.getMinutes());
	return (currentTimearr);
}

//to create a random time betwee 8AM to 9AM
export function random_time() : number[]
{
	const arr : number[] = [];
	let hours = Math.floor(Math.random() * (10 - 8 + 1)) + 9;
    let minutes = 42;
	arr.push(hours);
	arr.push(minutes);
	return (arr);
}

//here to get one random time a day and constantly check it against the real time
export async function rightTime(random_time : number []) : Promise<boolean>
{
	let both_times = [realTime(), random_time];
    console.log(`both times: ${both_times}`);
	let is_same_time = false;

	while (is_same_time == false)
	{
        console.log(`realTime: ${both_times[0]}`);
		if (both_times[0][0] === both_times[1][0] && both_times[0][1] === both_times[1][1])
			is_same_time = true;
		else
		{
			await sleep(59000);
			both_times[0] = realTime();
		}
	}
	return (is_same_time);
}
