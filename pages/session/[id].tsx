import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "components/avatar";
import LightLayout from "layouts/LightLayout";
import { useCallback, useState } from "react";
import Map from "components/map";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import SessionService from "service/session";
import { Location, User } from "type";
import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { SERVER } from "consts/const";
import { useCookies } from "react-cookie";
import withAuth from "hocs/withAuth";
const SessionVote = () => {
  const { query } = useRouter();
  const [cookies] = useCookies();
  const [pickLocation, setPickLocation] = useState<any>();
  const [usersOnline, setUsersOnline] = useState<User[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [locations, setLocations] = useState();
  const [count, setCount] = useState(0);
  const [ownVote, setOwnVote] = useState<string>('');
  const [currentVotes, setCurrentVotes] = useState<{ userId: string, locationId: string}[]>([])
  const { data } = useQuery([query.id], () => SessionService.getById(query.id));
  const session = data?.data || {};

  //<------------- socket.io --------------->

  const socketRef = useRef<Socket>();

  useEffect(() => {
    handleSocket();
  }, [session.id]);

  const getNumberOfOccurrences = useCallback((locationId: string) => {
    if (!currentVotes?.length) return 0;
    let n = 0;
    currentVotes?.forEach(v => {
        if (v.locationId === locationId) n++;
    })
    return n;
}, [currentVotes]);

  const handleSocket = () => {
    const userId = cookies.id;
    const socket = (socketRef.current = io(SERVER.URL));
    const data = { userId, sessionId: session.id };
    console.log('data : ', data);
    socket.on("connect", () => {
      socket.emit("join", data, (room: any, users: any) => {
        setUsersOnline(users);
      });
      socket.on("joined", (room: any, users: any) => {
        setUsersOnline(users);
      });

      socket.on('countdown', (second) => {
        setCount(second)
      })

      socket.on('voted', (room: any) =>{
        setCurrentVotes(room.votes)
      })
    });
  };

  const handleVote = (locationId: string) => {
    const socket = socketRef.current;
    if(socket){
      const userId = cookies.id;
      const data = { userId, sessionId: session.id, locationId };

      socket.emit('vote', data)
    }
  }

  return (
    <LightLayout>
      <div className="w-full md:max-w-2xl border rounded shadow mx-auto flex mt-4 flex-wrap">
        <div className="w-full flex">
          <div>
            <div>
              <h1 className="px-2 py-1 text-gray-600 text-sm font-semibold">
                Users đang online
              </h1>
              <ul>
                {usersOnline.map((user) => (
                  <li key={user.id} className="flex px-2 py-1 items-center text-gray-500 text-sm">
                    <Avatar size="xs" />
                    <span className="ml-1">{user.fullName ? user.fullName : 'Noname'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600 text-center my-2">
              Tiêu đê: {session.title} - Nội dung: {session.content}
            </div>
            <div className="text-5xl text-red-600 text-center">{count ? count + 's' : null}</div>
          </div>
        </div>
        <div className="w-full my-2 px-2 text-center">
          <ul className="flex flex-col gap-y-1 text-gray-600 text-sm">
            {!!session?.locations?.length &&
              session.locations.map((loc: Location) => {
                return (
                  <li
                    key={loc.id}
                    className={`hover:bg-gray-300 py-1 cursor-pointer ${ownVote === loc.id ? 'bg-red-300' : ''}`}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> - {loc.placeName}{" "}
                    - <span>{getNumberOfOccurrences(loc.id!)}Votes</span>{" "}
                    <button
                      onClick={(e) => {
                        setShowMap(true);
                        setPickLocation(loc);
                      }}
                      className="text-xs text-blue-50 bg-blue-500 py-1 px-2  rounded mx-2"
                    >
                      Xem trên map
                    </button>
                    <button
                      onClick={(e) => {
                        setOwnVote(loc.id!)
                        handleVote(loc.id!)
                      }}
                      className="text-xs text-blue-50 bg-green-500 py-1 px-2  rounded mx-2"
                    >
                      Vote
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
      {showMap && (
        <div className="absolute top-0 left-0 right-0 bottom-0">
          {" "}
          <Map
            drawR
            locations={pickLocation ? [pickLocation] : []}
            onCloseMap={() => setShowMap(false)}
          />
        </div>
      )}
    </LightLayout>
  );
};

export default withAuth(SessionVote);
