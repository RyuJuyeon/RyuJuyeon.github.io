import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import CFB from 'cfb';
const dir = process.argv[2];
if(!dir) throw new Error('Pass the source directory as the first argument');
await fs.mkdir('tmp/geometry',{recursive:true});
for (const name of (await fs.readdir(dir)).filter(name => name.endsWith('.hwp'))) {
  const file = CFB.read(await fs.readFile(path.join(dir,name)),{type:'buffer'});
  const header = CFB.find(file,'FileHeader');
  const compressed = !!(Buffer.from(header.content).readUInt32LE(36)&1);
  const paragraphs=[];
  for (let i=0;i<file.FullPaths.length;i++) {
    if(!/BodyText\/Section\d+$/.test(file.FullPaths[i])) continue;
    let bytes=Buffer.from(file.FileIndex[i].content);
    if(compressed) bytes=zlib.inflateRawSync(bytes);
    let offset=0;
    while(offset+4<=bytes.length){
      const header=bytes.readUInt32LE(offset);offset+=4;
      const tag=header&1023;let length=header>>>20;
      if(length===4095){length=bytes.readUInt32LE(offset);offset+=4;}
      if(tag===67){
        const chunk=bytes.subarray(offset,offset+length);let text='';
        for(let p=0;p+1<chunk.length;p+=2){const code=chunk.readUInt16LE(p);if(code>=32)text+=String.fromCharCode(code);else if([1,2,3,11,12,14,15,16,17,18,21,22,23,4,5,6,7,8,9,19,20].includes(code)){p+=14;text+=' ';}else if(code===10||code===13)text+='\n';}
        paragraphs.push(text);
      }
      offset+=length;
    }
  }
  await fs.writeFile(path.join('tmp/geometry',name+'.txt'),paragraphs.join('\n'));
  console.log(name, paragraphs.length, 'paragraphs');
}
