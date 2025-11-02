import { DimensionValue } from "react-native";

type Coordinate = {
    top: DimensionValue; // Sử dụng % hoặc số (px)
    left: DimensionValue;
};

type MapPath = {
    mapId: number;
    path: Coordinate[];
};

const MAP_COORDINATES: MapPath[] = [
    {
        mapId: 1, 
        path: [
            { top: '83%', left: '45%' },
            { top: '70%', left: '26%' },
            { top: '62%', left: '43%' },
            { top: '58%', left: '65%' },
            { top: '50%', left: '85%' },
            { top: '35%', left: '85%' },
            { top: '25%', left: '65%' },
            { top: '15%', left: '50%' },
            { top: '8%', left: '28%' },
            { top: '2%', left: '48%' },
        ]
    },
    {
        mapId: 2, 
        path: [
            { top: '85%', left: '45%' },
            { top: '70%', left: '12%' },
            { top: '60%', left: '30%' },
            { top: '58%', left: '55%' },
            { top: '50%', left: '75%' },
            { top: '40%', left: '55%' },
            { top: '35%', left: '25%' },
            { top: '22%', left: '37%' },
            { top: '8%', left: '28%' },
            { top: '0%', left: '45%' },
        ]
    },
    {
        mapId: 3, 
        path: [
            { top: '90%', left: '45%' },
            { top: '75%', left: '15%' },
            { top: '78%', left: '43%' },
            { top: '75%', left: '85%' },
            { top: '62%', left: '75%' },
            { top: '57%', left: '40%' },
            { top: '50%', left: '15%' },
            { top: '30%', left: '20%' },
            { top: '25%', left: '55%' },
            { top: '5%', left: '55%' },
        ]
    },
    {
        mapId: 4, 
        path: [
            { top: '88%', left: '45%' },
            { top: '75%', left: '76%' },
            { top: '65%', left: '50%' },
            { top: '62%', left: '23%' },
            { top: '55%', left: '15%' },
            { top: '42%', left: '48%' },
            { top: '35%', left: '85%' },
            { top: '25%', left: '65%' },
            { top: '15%', left: '50%' },
            { top: '8%', left: '28%' },
        ]
    },
    {
        mapId: 5, 
        path: [
            { top: '10%', left: '10%' },
            { top: '25%', left: '80%' },
            { top: '40%', left: '10%' },
            { top: '55%', left: '80%' },
            { top: '70%', left: '10%' },
        ]
    },
];

export {MAP_COORDINATES}
export type {Coordinate,MapPath}