<template>
  <div>
    <div class="conn-light"></div>
    <p class="conn-text">
      {{connectedText}} -
      {{(sync.daktronics.status.bitrate / 1000).toFixed(2)}} Kbps
    </p>
    <UFormField label="Feed Type" class="mt-4">
      <UInputMenu value-key="value" v-model="sync.daktronics.feed" :items="feeds" />
    </UFormField>
    <UInputMenu class="mt-4" :items="availablePortsOptions" value-key="value" v-model="sync.daktronics.selectedPort" ></UInputMenu>
    <UCheckbox size="lg" label="Show Advanced Settings" v-model="showAdvanced"></UCheckbox>
    
    <div v-if="showAdvanced && sync.daktronics.selectedPort === 'MOCK'">
      <h1>Mock Data Submission</h1>
      <h2>Bulk Upload</h2>
      <UAlert color="warning" v-if="mockBulkErrorMsg" :title="mockBulkErrorMsg"></UAlert>
      <UFileUpload v-model="mockFile" label="Click or drag a file to this area to upload" class="mt-10" @change="uploadChangedEvent">
      </UFileUpload>
      <USlider class="mt-10" :tooltip="true" :min="100" :max="100000" v-model="mockBulkDataSliderValue" :step="100" />
      <UFormField class="mt-10" label="Bitrate (approximate)">
        <UInputNumber :min="0" v-model="mockBulkDataSliderValue" :step="100" />
      </UFormField>

      <UAlert v-if="mockBulkDataSliderValue > 19200" class="mt-10" title="Impossible Bitrate"
        description="In real-world scenarios, bitrate will never exceed 19.2 Kbps (i.e., the baud rate)."
        color="info"
        >
      </UAlert>

      <UButton
        class="mt-10"
        @click="mockBulkButtonClicked"
        :disabled="mockBulkData === null"
        :color="mockBulkCurrentlyUploading ? 'error' : 'success'">
        {{ mockBulkCurrentlyUploading ? "Stop" : "Start" }}
      </UButton>
      <div v-if="mockBulkData">
        <p>Upload Progress</p>
        <p>{{ progress.toFixed(3) }}%</p>
        <UProgress v-if="mockBulkData" color="success" v-model="progress"  />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UCheckbox } from '#components';

const replicants = await useReplicants();
const sync = replicants.configuration.sync;
const showAdvanced = ref(false);
const mockBulkErrorMsg = ref<string|null>();
const mockBulkData = ref<Uint8Array|null>(null);
const mockBulkDataSliderValue = ref<number>(1500);
const mockBulkUploadProgress = ref<number>(0);
const mockBulkCurrentlyUploading = ref<boolean>(false);
const feeds = ref([{label: 'RTD', value: 'rtd'}, {label: 'TV', value: 'tv'}]);
const mockFile = ref<File|null>(null);
const progress = computed(() => {
  return mockBulkData ? (mockBulkUploadProgress.value / mockBulkData.value!.byteLength * 1000) / 1000 * 100 : 0;
});
const availablePortsOptions = computed<{label: string, value: string}[]>(() => {
	// Map the available ports to the options that the NSelect component expects.
	const arr = sync.daktronics.availablePorts.map((port) => {
		return { label: port, value: port };
	});

	// If the selected port is not in the list of available ports, add it to the list.
	if(
		sync.daktronics.selectedPort !== 'MOCK' &&
		sync.daktronics.selectedPort &&
		sync.daktronics.availablePorts.indexOf(sync.daktronics.selectedPort) < 0
	) {
		arr.push({label: sync.daktronics.selectedPort + ' (Disconnected)', value: sync.daktronics.selectedPort});
	}

	// If the selected port is MOCK, or if the user has enabled advanced settings, add MOCK to the list.
	if(sync.daktronics.selectedPort === "MOCK" || showAdvanced.value) {
		arr.push({label: "Mock", value: "MOCK"});
	}

	return arr;
});

// The color of the "light" on the serial port connection status indicator.
const connLightColor = computed<string>(() => {
	if (sync.daktronics.status.error) {
		return "#db9a4f";
	} else if (sync.daktronics.status.connected) {
		return "#93db4f";
	} else {
		return "#eb7434";
	}
});

const connectedText = computed<string>(() => {
	if (sync.daktronics.status.error) {
		return sync.daktronics.status.errorMsg;
	} else if(sync.daktronics.status.connected) {
		return 'Connected';
	} else if(sync.daktronics.selectedPort) {
		return 'Connecting...';
	} else {
		return 'Disconnected';
	}
});


/**
 * If there is no mock bulk upload currently happening, then this submits the file which the user has selected to be
 *   uploaded as mock data. Useful for rapid testing of many types of packets split across multiple incoming data
 *   chunks, much like a real-world scenario. If there is already a mock bulk upload happening, then this cancels it.
 */
async function mockBulkButtonClicked(): Promise<void> {
	if(mockBulkCurrentlyUploading.value) {
		mockBulkCurrentlyUploading.value = false;
		return;
	}

	mockBulkCurrentlyUploading.value = true;
	let bytes: number[] = [];
	let lastSentByteNumber = 0;
	for(mockBulkUploadProgress.value = 0; mockBulkUploadProgress.value < (mockBulkData.value?.length || 0); mockBulkUploadProgress.value++) {
		const selectedBitsPerSecond = mockBulkDataSliderValue.value / 8
		if(!mockBulkCurrentlyUploading.value) {
			return;
		}
		if(!mockBulkData.value || mockBulkData.value.at(mockBulkUploadProgress.value) === undefined) {
			continue;
		}
		bytes.push(<number>mockBulkData.value.at(mockBulkUploadProgress.value));
		if(mockBulkUploadProgress.value - lastSentByteNumber >= selectedBitsPerSecond / 10) {
			// mockChannel.send(bytes);
      sync.daktronics.mock.packet = bytes;
			lastSentByteNumber = mockBulkUploadProgress.value;
			bytes = [];
			await new Promise(resolve => setTimeout(resolve, 100));
		}
	}
	mockBulkCurrentlyUploading.value = false;
}

/**
 * Callback for when the user selects a file to upload as mock data. The data is not actually uploaded to the
 *   mock channel until the user clicks the "Submit" button. This is also the callback for when the user removes
 *   a file from the input field.
 * @param uploadEvent Event containing the file data, and the native DOM event. If the user is removing a file,
 *   then `uploadEvent.file` will contain the file that was removed, but `uploadEvent.event` will be undefined.
 */
function uploadChangedEvent(): void {
	// If there is no browser attached to the NaiveUI event, then the file is being removed, not uploaded.
  if (!mockFile.value) {
    return;
  }

	// Add handler for after reading the "uploaded" file, then read the file.
	const fr = new FileReader();
	fr.addEventListener('loadend', (readEvent) => {
		// Sanity check to confirm a file was actually read. If not, some error occurred.
		if(!readEvent.target || !readEvent.target.result) {
			mockBulkErrorMsg.value = 'File upload failed. Try again.'
			mockBulkData.value = null;
			return;
		}
		// File successfully read. Check the file's contents to make sure it's a valid Daktronics RTD feed.
		const fileContents = new Uint8Array(<ArrayBuffer>readEvent.target.result);
		// First byte is always 0x16 in a valid RTD feed.
		// if(fileContents.at(0) !== 0x16) {
		// 	mockBulkErrorMsg.value = 'That file doesn\'t appear to be a valid Daktronics RTD feed.';
		// 	mockBulkData.value = null;
		// } else {
			mockBulkData.value = fileContents;
		// 	mockBulkErrorMsg.value = null;
		// }
	});
	fr.readAsArrayBuffer(mockFile.value);
}

onBeforeUnmount(() => {
  mockBulkCurrentlyUploading.value = false;
});
</script>

<style>
.conn-light {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 5px;
  border-radius: 50%;
  background-color: v-bind(connLightColor);
}
.conn-text {
  display: inline-block;
}
.mt-10 {
  margin-top: 10px;
}
h1 {
  margin: 0;
}
</style>