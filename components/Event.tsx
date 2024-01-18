import React from "react";
import Router from "next/router";
import Image from "next/image";
import {useSession} from "next-auth/react";

export type EventProps = {
    id: string;
    title: string;
    location: string;
    description: string;
    eventURL: string;
    date: string;
    image?: string;
    createdBy: {
        name: string;
        email: string;
    } | null;
    published: boolean;
};

function formatDate(dateString: string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayOfWeek = days[date.getDay()];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${dayOfWeek} ~ ${month}/${day}/${year}`;
}


const Event: React.FC<{ event: EventProps }> = ({event}) => {
    const {data: session} = useSession();

    async function deleteEvent(id: string): Promise<void> {
        await fetch(`/api/event/${id}`, {
            method: 'DELETE',
        });
        Router.push('/')
    }
console.log(event)
    return (
        <div id="card" className="">
            <div className="container w-100 lg:w-4/5 mx-auto flex flex-col">
                <div v-for="card in cards" className="flex flex-col md:flex-row overflow-hidden
                                        bg-slate-950 rounded-md shadow-xl  mt-4 w-100 mx-2 opacity-80">
                    <div className="w-auto md:w-1/2">
                        <Image
                            className="inset-0 h-full w-full object-cover object-center"
                            src="https://lh3.googleusercontent.com/fife/AGXqzDmJSdl6yLYMxAcnIRexhswZfOanFBmjIE-slErvDx8a82GskH4vHJYj11IwPlISMaljBsld3YTP5-UlM4H41YTATipvTmzULKgYDDVmxpognSoi9JUJLwQ-AgVCvBrud1JAZxuWoVIEy1DsJJcHwRnuSaDVYw29_757rQVAAL7fHPVIzdg7EOVEksmKLz-S8WiD8AeXKv3QJjFgMgoxs6RqARVzg5eo9PRx0QRlpxf90INVN_B4n0j_VI7O14R7tczIx-A0-Eu-SCIaW8uSjIrVtkN57WQicxE1L2OI29Tz0q3ewH8wtrioZ5acisuS_M2TvKJvJQuihBfK9RnIdZy-c2ASMBFBlfmeEfMXosgLNyfPaUfu4Atszy2RzYbvrWwX8-6JLfNMOO_cUmGlevqsmthSptxVAu33tCdmZMVox9gEbCDh066jvuB8CPZBR0_0VmuVGJPdA_KURiXJvxJzODB_IjPfxM8dW9DaEe-3-D3BURx2F7ysKDhWhJE39dZVdW14GZzcevQgPHW8pRQAxO2qFTZnyhLVTUdF5IzoSbOG2DeiqFMkny9TobNWNio1jRzfj_8VL3VKkSxIOTFZ86dWNAEN4IMcN0gND3J7pLLGtj2_bAqc2wiIIttBSFalItnOU_YbcXCI6sj_k3tdaWzMvTC3LtOSDeBr7auwZTvdNgiJuqNjdOh3VCb8kPySMbGQATtDdw5nzq_GV55k_zLx1QBa7V8g426F1mezfAP6SKiJns7VLkaDSpLFcTwYzUrJ8X1CEcXcwONQLeu-4ZfyD8-lbCruTcV7vWcQa6KvmIC5DbLihIgMkRN9OiDS752pWbdsl7BU_TwUNpt07XXwrmWt0oB4RH_bpaOTG8TeFKelmq5tCM6fCJz9pm2S2HsbhhZQohRLaxPccdoNwoffCZUDDn2NBoUCYtBmLngDHGwNAxjD2Hi-kKziN-mcvfmTq6Fjl9kgNU_eLl-MnC4KWun8DRHmvVbKgJY2IVnlk1Y-RIflfEKmR2LoFWjxJOODNsQumF2s34pEM4IzAO3G7U2XBo4VJU8DOhwRuFL7wsjQ_LefehghrqQEcdPvNf8EDh_ykmExZUULZCC714S90gFtRUUlrNAIxm9gilWsyBfpWszPOCHPjjYczpQ1TEWsraHyjwTJh4MnjHRCwlCltTJ3M309Ta39SQrWXWhH-5_DQ7pBoe28eKEMlrvP8VuVsxdeJEwRK72iljqvD2K0zr2nxiXddAhy9eMvMETRRRCcLmSDwWThOVECJm_849k5oRvv4TUvCgvNFP_3duUklTRD48zx1Xx98Lm1OxWT8M8TDh-9cxU3NUP4cv3jAyUpvU75tbWp5UDmYnemG6FCXHMsGNeCu6ys54k0y3KH42WXy_qNZ1ZsaGbiZfO6XvsaQ9ROK2mfW40vJ-GBcs-jq2xmd048QBrFz2yove021xLkSQnyOLZyUOwIcO6nOukNTZC9mj87T7mWzhGlLH1hxMjPGa4r3Nl4NwERoQrXEzLjOLYcoOAp5H0X61iZPhT7eK9CHDCxsaBng71UdqjKlL5g501mcjVnCPiyF_ZEh9DTYFB0HVem85ljGcRoP7dzCPe2aZjGYpCiM_kn1I9BOhADg6VxUrbbNwPv0Q-lA_i8H4SAmS_JrtK9jdYEv91wInRD3wUZytl57DM8sbqwqUAFxuYib0hWhCpSE7hxt6SXk20VdvkV4zh5UYBmw63qEu5FMAutQx7ul0LsxNiMhbBj35-PW3BJv05s4S3Whyt9JTY=s920-w920-h904-s-no-gm?authuser=0"
                            width={400}
                            height={100}
                            alt="Dead Streets Wolf Logo"
                        />
                    </div>
                    <div className="w-full py-4 px-6 text-white flex flex-col">
                        <h3 className="font-semibold text-2xl text-white leading-tight truncate">{event.title}</h3>
                        <p className="mt-2 text-lg">
                            {event.location}
                        </p>
                        <p className="mt-2 text-lg">
                            {event.description}
                        </p>
                        {event.eventURL && <a href={event.eventURL} target="_blank"
                                               className="mt-2 text-lg underline text-blue-300">
                            Event Page
                        </a>}
                        <p className="text-lg text-gray-700 text-white tracking-wide font-semibold mt-2">
                            {formatDate(event.date)}
                        </p>
                        {session &&
                            <>
                              <button
                                  className="bg-red-600 p-3 rounded-md my-2"
                                  onClick={() => deleteEvent(event.id)}
                              >
                                Delete
                              </button>
                              <button
                                  className="bg-green-600 p-3 rounded-md my-2"
                                  onClick={() => Router.push(`/create?id=${event.id}`)}
                              >
                                Edit Event
                              </button>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Event;

