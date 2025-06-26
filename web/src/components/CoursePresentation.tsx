import '../styles/CoursePresentation.css';
import React, { useEffect, useState } from 'react';

// create course interface
export interface Course {
    code: string
    title: string
    description: string
    summary: string | null
    date: string
    weekdays: string
    placesLeft: boolean
    places: string[]
    events: CourseEvent
    prices: CoursePrice[]
    categories: string[]
}

export interface CourseEvent {
    eventCount: number
    eventTimes: {
        count: number
        time: string
    }[]
}

export interface CoursePrice {
    name: string
    price: number
    currency: string
}

export interface CourseArray {
    courses: Course[]
}

export interface OverviewCourseCard {
    code: string
    title: string
    description: string | null
    date: string
}

interface CoursePresentationProps {
    courses: Course[]
    onSubmit: (index: number) => void
    onRender: () => void
}

export const CoursePresentation: React.FC<CoursePresentationProps> = ({courses, onSubmit, onRender}) => {
    // create variable to show expanded course
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    function get_course_oveview_data() {
        return (courses.map((course) => {
            return {
                code: course.code,
                title: course.title,
                description: course.summary,
                date: course.date
            }
        }))
    }

    return (
        <>
            {/* expanded course */}
            {typeof expandedIndex == "number" && (
                <CoursePresentationFull 
                    courses={[courses[expandedIndex]]}
                    onCollapse={() => setExpandedIndex(null)}
                    onSubmit={() => onSubmit(expandedIndex)}
                />
            )}

            {/* course overview */}
            {typeof expandedIndex != "number" && (
                <CoursePresentationOverview 
                    courses={get_course_oveview_data()}
                    onExpand={idx => {setExpandedIndex(idx); onRender()}}
                    onSubmit={idx => onSubmit(idx)}
                />
            )}
        </>
    )
};

export interface FullCourseViewProps {
    courses: Course[];
    onCollapse: () => void;
    onSubmit: () => void;
}

export const CoursePresentationFull: React.FC<FullCourseViewProps> = ({ courses, onCollapse, onSubmit }) => {
    const course = courses[0];

    // return html template
    return(
        <div className="course-presentation">

            {/* Create Course card for each course */}
            <div className="course-presentation-card">
                <h2 id="CoursePresentationTitle">{course.title}</h2>
                <p id="course-presentation-card-subtitle">{course.code} · {course.date}</p>

                <hr/>

                <h3>Beschreinung:</h3>
                <p dangerouslySetInnerHTML={{ __html: course.description }}>
                </p>

                <h3>Events:</h3>
                <p>
                    Der Kurs hat {course.events.eventCount} Events

                    <ul>
                    {course.events.eventTimes.map((event, index) => (
                        <li key={index}>{event.count}x {event.time}</li>
                    ))}
                    </ul>
                </p>

                <h3>Standort:</h3>
                <p>
                    <ul>
                    {course.places.map((place, index) => (
                        <li key={index}>{place}</li>
                    ))}
                    </ul>
                </p>

                <h3>Preis:</h3>
                <p>
                    <ul>
                        {course.prices.map((price, index) => (
                            <li key={index}>{price.name}: {price.price} {price.currency}</li>
                        ))}
                    </ul>
                </p>

                <div className="course-presentation-card-footer">
                    <button id="course-presentation-card-button-1" onClick={onCollapse}>
                        <p style={{textAlign: "center"}}>Weniger Infos</p>
                    </button>
                    <button id="course-presentation-card-button-2" onClick={onSubmit}>
                        <p style={{textAlign: "center"}}>Anmelden</p>
                    </button>
                </div>
            </div>
        
        </div>
    )
};

export interface OverviewCourseCardProps {
    courses: OverviewCourseCard[];
    onExpand: (index: number) => void;
    onSubmit: (index: number) => void;
}

export const CoursePresentationOverview: React.FC<OverviewCourseCardProps> = ({ courses, onExpand, onSubmit }) => {
    // return html template
    return(
        <div className="course-presentation">

            {/* Create Course card for each course */}
            {courses.map((course, index) => (

                <div className="course-presentation-card" key={index}>
                    <div className="course-presentation-card-header">
                        <h2 id="CoursePresentationTitle">{course.title}</h2>
                    </div>
                    
                    <div className="course-presentation-card-content">
                        <p id="course-presentation-card-subtitle">{course.code} · {course.date}</p>
                    
                        <hr/>

                        <h3>Kurs Zusammenfassung:</h3>
                        {typeof course.description === "string" && (
                            <p dangerouslySetInnerHTML={{ __html: course.description }}></p>
                        )}
                    </div>

                    <div className="course-presentation-card-footer">
                        <button id="course-presentation-card-button-1" onClick={() => onExpand(index)}>
                            <p style={{textAlign: "center"}}>Mehr Infos</p>
                        </button>
                        <button id="course-presentation-card-button-2"  onClick={() => onSubmit(index)}>
                            <p style={{textAlign: "center"}}>Anmelden</p>
                        </button>
                    </div>
                </div>

            ))}
        
        </div>
    )
};