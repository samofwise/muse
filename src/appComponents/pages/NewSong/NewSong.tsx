import * as React from 'react';
import NavBar from '../../common/NavBar';
import Dropzone, { FileWithPath } from 'react-dropzone';
import { createStyles, Theme, LinearProgress } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { convertOnSong as parseOnSong } from '../../../core/songUtils';
import { songsApi } from '../../../core/api/songsApi';
import { sleep, promiseAllProgress } from '../../../core/utils';
import Song from '../../../core/models/Song';

const styles = (theme: Theme) =>
	createStyles({
		baseStyle: {
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			padding: '20px',
			borderWidth: 2,
			borderRadius: 2,
			borderColor: '#eeeeee',
			borderStyle: 'dashed',
			backgroundColor: '#fafafa',
			color: '#bdbdbd',
			outline: 'none',
			transition: 'border .24s ease-in-out'
		},
		activeStyle: {
			borderColor: '#2196f3'
		},
		acceptStyle: {
			borderColor: '#00e676'
		},
		rejectStyle: {
			borderColor: '#ff1744'
		}
	});

type Props = WithStyles<typeof styles>;

const uploadSong = async (song: Song) => {
	await songsApi.addSong(song);
};

class UploadFile {
	constructor(file: FileWithPath) {
		this.name = file.path;
		this.file = file;
		this.status = 'Uploading';
	}
	name: string;
	file: FileWithPath;
	status: 'Uploading' | 'Parsing' | 'Success' | 'Failed';
	message: string;
}

const NewSong = ({ classes }: Props) => {
	const [files, setFiles] = React.useState([] as UploadFile[]);
	const [progress, setProgress] = React.useState(0);

	const onDrop = async (acceptedFiles: FileWithPath[]) => {
		const uploadFiles = acceptedFiles.map(f => new UploadFile(f)).sort((a, b) => a.name.localeCompare(b.name));
		setFiles(uploadFiles);

		const updateFile = (file: UploadFile) => {
			setFiles(currentFiles => {
				const newFiles = [...currentFiles];
				const index = newFiles.findIndex(f => f.name === file.name);
				newFiles[index] = file;
				return newFiles;
			});
		};

		const uploadPromises = [] as Promise<void>[];

		uploadFiles.forEach(uploadFile => {
			const errored = (message: string) => {
				const newFile: UploadFile = { ...uploadFile, message, status: 'Failed' };
				updateFile(newFile);
				throw message;
			};

			const reader = new FileReader();

			reader.onabort = () => console.log('file reading was aborted');
			reader.onerror = () => console.log('file reading has failed');
			reader.onloadend = async (e: ProgressEvent<FileReader>) => {
				if (e.target.readyState !== 2) throw 'ReadyState was not 2 on end';
				if (e.target.error) {
					errored('Error while reading file');
					uploadPromises.push(Promise.reject());
					return;
				}
				updateFile({ ...uploadFile, status: 'Parsing' });

				const value = e.target.result as string;

				const parsedSong = parseOnSong(value);
				updateFile({ ...uploadFile, status: 'Uploading' });
				console.log(parsedSong);
				const upload = uploadSong(parsedSong)
					.then(() => updateFile({ ...uploadFile, status: 'Success' }))
					.catch(error => errored(`Error while parsing file: ${error}`));
				uploadPromises.push(upload);
			};
			reader.readAsText(uploadFile.file);
		});

		while (uploadPromises.length !== uploadFiles.length) {
			await sleep(500);
		}
		await sleep(500);

		await promiseAllProgress(uploadPromises, setProgress);
		alert('Completed');
	};

	return (
		<>
			<NavBar title="New Song" />
			<section>
				<Dropzone onDrop={onDrop}>
					{({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => (
						<section>
							<div
								{...getRootProps({
									className: clsx(classes.baseStyle, {
										[classes.activeStyle]: isDragActive,
										[classes.acceptStyle]: isDragAccept,
										[classes.rejectStyle]: isDragReject
									})
								})}
							>
								<input {...getInputProps()} />
								<p>Drag 'n' drop some files here, or click to select files</p>
							</div>
						</section>
					)}
				</Dropzone>
				<aside>
					<h4>Files</h4>
					{files.length ? <LinearProgress variant="determinate" value={progress} /> : ''}
					<ul>
						{files.map((f, i) => (
							<li key={i}>
								{f.name} - {f.status}
								{f.message ? `: ${f.message}` : ''}
							</li>
						))}
					</ul>
				</aside>
			</section>
		</>
	);
};

export default withStyles(styles)(NewSong);
