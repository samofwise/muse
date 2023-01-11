import * as React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { List, RootRef } from '@material-ui/core';
import SongList from './SongList';

interface ThisProps {
	onDragEnd: (result: DropResult, provided: ResponderProvided) => void;
	children: React.ReactNode;
	className?: string;
}

export const SetList = (props: ThisProps) => {
	return (
		<DragDropContext onDragEnd={props.onDragEnd}>
			<Droppable droppableId="droppable">
				{(provided, snapshot) => (
					<RootRef rootRef={provided.innerRef}>
						<SongList title="Set" className={props.className}>
							{props.children}
							{provided.placeholder}
						</SongList>
					</RootRef>
				)}
			</Droppable>
		</DragDropContext>
	);
};
